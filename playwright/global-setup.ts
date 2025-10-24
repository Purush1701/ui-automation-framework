import { FullConfig } from '@playwright/test';
import SessionManager from './utils/session-manager.js';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...');

  // Use simplified session manager with enhanced session storage support
  const sessionManager = SessionManager.getInstance();

  // Ensure session is available (restore existing or create new)
  await sessionManager.ensureSession();

  console.log('🎉 Global setup completed successfully!');
}

export default globalSetup;
