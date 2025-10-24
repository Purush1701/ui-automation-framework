import { Page } from '@playwright/test';
import { authenticator } from 'otplib';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Authentication Service for Azure B2C with MFA
 * Handles complete login flow including SMS OTP verification
 */
export class AuthenticationService {
  constructor(private page: Page) {}

  /**
   * Complete authentication flow with Azure B2C + MFA
   */
  async authenticate(): Promise<boolean> {
    console.log('🔐 Starting Azure B2C authentication...');

    try {
      // Step 1: Navigate to application and check if already authenticated
      const baseUrl = process.env['CP_BASE_URL']!;
      await this.page.goto(baseUrl);
      console.log('📍 Navigated to application:', baseUrl);

      // Wait a moment for any automatic redirects
      await this.page.waitForTimeout(3000);

      // Check if we're already authenticated (not redirected to B2C)
      if (await this.isAuthenticated()) {
        console.log('✅ Already authenticated - skipping login process');
        return true;
      }

      // Step 2: Wait for Azure B2C login form
      await this.waitForAzureB2CLogin();

      // Step 3: Fill login credentials
      await this.fillLoginCredentials();

      // Step 4: Handle MFA if present
      const mfaRequired = await this.handleMFAIfPresent();

      if (mfaRequired) {
        console.log('✅ MFA completed successfully');
      }

      // Step 5: Wait for successful redirect
      await this.waitForSuccessfulLogin();

      console.log('✅ Authentication completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      return false;
    }
  }

  /**
   * Wait for Azure B2C login form to appear
   */
  private async waitForAzureB2CLogin(): Promise<void> {
    console.log('⏳ Waiting for Azure B2C login form...');

    // Wait for email input
    await this.page.waitForSelector('#signInName', { timeout: 10000 });

    console.log('✅ Azure B2C login form detected');
  }

  /**
   * Fill login credentials
   */
  private async fillLoginCredentials(): Promise<void> {
    console.log('📝 Filling login credentials...');

    const email = process.env['CP_USERNAME'];
    const password = process.env['CP_PASSWORD'];

    if (!email || !password) {
      throw new Error('❌ Missing credentials! Set CP_USERNAME/CP_PASSWORD in .env file');
    }

    // Find and fill email field
    const emailField = this.page.locator('input#signInName');

    if (await emailField.isVisible({ timeout: 2000 })) {
      await emailField.fill(email);
      console.log('✅ Email filled');
    } else {
      console.log('⚠️ Email field not found or not visible');
    }

    // Find and fill password field
    const passwordField = this.page.locator('input#password');

    if (await passwordField.isVisible({ timeout: 2000 })) {
      await passwordField.fill(password);
      console.log('✅ Password filled');
    } else {
      console.log('⚠️ Password field not found or not visible');
    }

    // Click sign in button
    const signInButton = this.page.locator('button#next');

    if (await signInButton.isVisible({ timeout: 2000 })) {
      await signInButton.click();
      console.log('✅ Sign in button clicked');
    } else {
      console.log('⚠️ Sign in button not found or not visible');
    }

    await this.page.waitForTimeout(2000);
  }

  /**
   * Handle MFA if present (SMS OTP)
   */
  private async handleMFAIfPresent(): Promise<boolean> {
    console.log('🔍 Checking for MFA requirement...');

    try {
      // Wait a bit for page to potentially show MFA form
      await this.page.waitForTimeout(3000);

      // Use stable selector for OTP input
      const otpInput = this.page.locator('input#otpCode');

      // Check if MFA input is visible
      if (!(await otpInput.isVisible({ timeout: 2000 }))) {
        console.log('ℹ️ No MFA input field detected');
        return false;
      }

      console.log('📱 MFA detected - generating TOTP...');

      // Generate TOTP
      const otp = this.generateOTP();
      console.log(`🔢 Generated OTP: ${otp}`);

      // Fill OTP
      await otpInput.fill(otp);
      console.log('✅ OTP filled');

      // Click verify button
      const verifyButton = this.page.locator('button#continue');

      if (await verifyButton.isVisible({ timeout: 2000 })) {
        await verifyButton.click();
        console.log('✅ Verify button clicked');
      } else {
        console.log('⚠️ Verify button not found or not visible');
      }

      await this.page.waitForTimeout(3000);
      return true;
    } catch (error) {
      console.log('ℹ️ No MFA required or MFA step skipped:', (error as Error).message || 'Unknown error');
      return false;
    }
  }

  /**
   * Wait for successful login and redirect
   */
  private async waitForSuccessfulLogin(): Promise<void> {
    console.log('⏳ Waiting for successful login redirect...');

    // Wait for redirect to application (not B2C domain)
    let attempts = 0;
    const maxAttempts = 60; // 60 seconds for full authentication flow

    while (attempts < maxAttempts) {
      const currentUrl = this.page.url();
      console.log(`🔍 Current URL (attempt ${attempts + 1}): ${currentUrl}`);

      // Success condition: back on app domain and not on redirecting page
      if (currentUrl.includes('app.example.com') && !currentUrl.includes('redirecting') && !currentUrl.includes('b2clogin.com')) {
        console.log('✅ Successfully redirected to application');

        // Wait for Angular to process authentication and save tokens
        console.log('⏳ Waiting for Angular to process authentication tokens...');
        await this.page.waitForTimeout(5000); // 5 seconds for MSAL token processing

        // Wait for application DOM to be ready (SPA-friendly)
        await this.page.waitForLoadState('domcontentloaded');
        break;
      }

      if (attempts === maxAttempts - 1) {
        throw new Error(`Authentication timeout - still on: ${currentUrl}`);
      }

      await this.page.waitForTimeout(1000);
      attempts++;
    }

    console.log('✅ Successfully logged in and redirected');
  }

  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check URL - should not contain login/auth paths
      const url = this.page.url();
      if (url.includes('login') || url.includes('b2c') || url.includes('auth')) {
        return false;
      }

      // Check for authenticated content
      const authenticatedElements = ['.sidebar'];

      for (const selector of authenticatedElements) {
        try {
          await this.page.locator(selector).waitFor({ state: 'visible', timeout: 3000 });
          return true;
        } catch {
          continue;
        }
      }

      return false;
    } catch {
      return false;
    }
  }

  /**
   * Generate OTP using TOTP algorithm
   */
  private generateOTP(): string {
    const otpSecret = process.env['CP_OTPSECRET'];
    if (!otpSecret) {
      throw new Error('❌ OTP secret not found! Set CP_OTPSECRET in .env file');
    }
    return authenticator.generate(otpSecret);
  }
}
