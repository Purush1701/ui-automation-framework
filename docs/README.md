# Web Application Test Automation Framework

[![Playwright Tests](https://img.shields.io/badge/tests-playwright-2EAD33.svg)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue.svg)](https://www.typescriptlang.org/)

A comprehensive end-to-end test automation framework for web applications built with Microsoft Playwright.

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running Tests](#-running-tests)
- [Test Development](#-test-development)
- [CI/CD Integration](#-cicd-integration)
- [Docker Support](#-docker-support)
- [Project Structure](#-project-structure)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

## ✨ Features

- **Cross-browser Testing**: Chromium, Firefox, and WebKit support
- **Multi-environment Support**: Development, Staging, and UAT environments
- **Session Management**: Persistent authentication across test runs
- **Parallel Execution**: Optimized test performance with configurable workers
- **Rich Reporting**: HTML reports with screenshots, videos, and traces
- **Docker Support**: Containerized test execution for CI/CD pipelines
- **TypeScript Support**: Full type safety and IntelliSense
- **Page Object Model**: Maintainable and scalable test architecture
- **Auto-retry Logic**: Configurable retry mechanisms for flaky tests

## 🔄 Framework Migration

This repository demonstrates a real-world migration from **Cypress** to **Playwright**, showcasing the evolution of our testing strategy:

### **Migration Overview**
- **Legacy Framework**: Cypress (JavaScript/TypeScript)
- **Modern Framework**: Playwright (TypeScript)
- **Migration Strategy**: Gradual transition with parallel implementation
- **Timeline**: Progressive migration allowing for comparison and validation

### **Why We Migrated**
- **Performance**: Playwright's faster execution and better parallelization
- **Cross-browser Support**: Native multi-browser testing capabilities
- **Modern Architecture**: Better TypeScript support and API design
- **Maintenance**: Reduced flakiness and improved reliability
- **Developer Experience**: Enhanced debugging and reporting features

### **Repository Structure**
```
├── playwright/           # Modern Playwright implementation
│   ├── ClientPortal/    # Main application tests
│   ├── utils/          # Shared utilities and services
│   └── config/         # Playwright configuration
├── cypress/            # Legacy Cypress implementation
│   ├── e2e/           # End-to-end tests
│   ├── support/       # Custom commands and utilities
│   └── fixtures/      # Test data and fixtures
└── docs/              # Documentation and guides
```

### **Migration Benefits**
- **Side-by-side Comparison**: Both frameworks available for evaluation
- **Knowledge Transfer**: Team can learn from both implementations
- **Risk Mitigation**: Gradual transition reduces deployment risks
- **Best Practices**: Demonstrates framework selection criteria
- **Real-world Experience**: Shows actual migration challenges and solutions

### **Running Both Frameworks**
```bash
# Run Playwright tests (primary)
npm run test:playwright

# Run Cypress tests (legacy)
npm run test:cypress

# Run both for comparison
npm run test:all
```

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd web-automation-framework

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Configure environment
cp playwright/.env.example playwright/.env
# Edit playwright/.env with your credentials

# Run tests
npm run test:playwright
```

## 📋 Prerequisites

### System Requirements

- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0 
- **Operating System**: Windows 10+, macOS 10.15+, or Ubuntu 18.04+
- **Memory**: Minimum 4GB RAM (8GB recommended)

### Environment Access

- Application Client Portal credentials
- Application Back Office access
- GitHub Personal Access Token (for private packages)

## 🔧 Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
# Install all browsers
npx playwright install

# Install specific browser only
npx playwright install chromium
```

### 3. Verify Installation

```bash
# Check Playwright version
npx playwright --version

# List available tests
npm run test:playwright -- --list
```

## ⚙️ Configuration

### Environment Variables

Create `playwright/.env` file with your configuration:

```env
# Client Portal Configuration
CP_BASE_URL={CLIENT_PORTAL_URL}
CP_USERNAME=your.email@company.com
CP_PASSWORD=your_secure_password
CP_OTPSECRET=your_otp_secret_key

# Back Office Configuration
BO_BASE_URL={BACK_OFFICE_URL}
BO_USERNAME=your.backoffice@company.com
BO_PASSWORD=your_bo_password
BO_OTPSECRET=your_bo_otp_secret

# Back Office API Configuration
BOAPI_CLIENT_ID=your_client_id
BOAPI_CLIENT_SECRET=your_client_secret
BOAPI_SCOPE=your_api_scope

# GitHub Token (required for private packages)
GITHUB_TOKEN=ghp_your_github_token_here
```

### GitHub Token Setup

The project requires a GitHub Personal Access Token to access private packages. Follow these steps to set it up:

#### 1. Create Personal Access Token

1. Navigate to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Provide a descriptive name (e.g., "Web Automation Framework")
4. Set expiration (recommended: 90 days or custom)

#### 2. Configure Required Scopes

Select the following scopes for your token:

- ✅ **`read:packages`** - Required to download private npm packages
- ✅ **`repo`** - Required if accessing private repositories
- ⚠️ **Additional scopes** - Add others as needed for your specific use case

#### 3. Authorize for Organization

After creating the token:

1. **Enable SAML SSO**: Click "Enable SSO" next to the organization
2. **Authorize the token**: Complete the SAML authentication flow
3. **Verify access**: Ensure the token shows "Authorized" for the organization

#### 4. Add Token to Environment

Update your `playwright/.env` file:

```env
# Replace the placeholder with your actual token
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 5. Set as System Environment Variable (Required for npm)

For npm to access the token via `.npmrc`, you must set it as a permanent system environment variable:

##### Windows (PowerShell)

```powershell
# Using setx command (simple)
setx GITHUB_TOKEN "ghp_your_actual_token_here"

# Using .NET Environment class (advanced)
[System.Environment]::SetEnvironmentVariable('GITHUB_TOKEN', 'ghp_your_actual_token_here', [System.EnvironmentVariableTarget]::User)
```

**Verification:**
```powershell
# Restart PowerShell, then check if variable is accessible
$env:GITHUB_TOKEN
```

##### macOS/Linux

```bash
# Add to ~/.bashrc, ~/.zshrc, or ~/.profile
echo 'export GITHUB_TOKEN=ghp_your_actual_token_here' >> ~/.bashrc

# Reload shell configuration
source ~/.bashrc
```

#### 6. Verify Setup

Test your token configuration:

```bash
# Test npm authentication with GitHub packages
npm config set @your-org:registry https://npm.pkg.github.com
npm config set //npm.pkg.github.com/:_authToken ${GITHUB_TOKEN}

# Verify access to private packages
npm view @your-org/your-package version
```

#### Security Best Practices

- 🔒 **Never commit tokens** to version control
- 🔄 **Rotate tokens regularly** (every 90 days recommended)
- 📝 **Use descriptive names** to track token usage
- 🚫 **Revoke unused tokens** immediately
- 👥 **Use organization secrets** in CI/CD pipelines

#### Troubleshooting Token Issues

**Authentication Failed:**
```bash
# Check if token is properly set
echo $GITHUB_TOKEN

# Verify token permissions
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

**Package Access Denied:**
- Ensure SAML SSO is enabled for the token
- Verify `read:packages` scope is selected
- Check if you're a member of the organization

**Token Expired:**
- Create a new token following the same steps
- Update the `GITHUB_TOKEN` value in your `.env` file
- Consider setting a longer expiration period

### Playwright Configuration

The main configuration is in `playwright/playwright.config.ts`:

```typescript
export default defineConfig({
  testDir: './ClientPortal/tests',
  timeout: 90_000,
  retries: 1,
  workers: 1, // Adjust based on your system
  
  projects: [
    {
      name: 'ClientPortal',
      testDir: './ClientPortal/tests',
      use: { baseURL: CP_BASE_URL }
    },
    {
      name: 'BackOffice', 
      testDir: './BackOffice/tests',
      use: { baseURL: BO_BASE_URL }
    }
  ]
});
```

## 🧪 Running Tests

### Command Line Interface

```bash
# Run all tests
npm run test:playwright

# Run tests in UI mode (interactive)
npm run playwright:ui

# Run specific test file
npx playwright test ClientPortal/tests/fiat-transfer-in.spec.ts

# Run tests with specific browser
npx playwright test --project=ClientPortal

# Run tests in headed mode (visible browser)
npx playwright test --headed

# Run tests with debug mode
npx playwright test --debug
```

### Environment-specific Execution

```bash
# Development environment
ENVIRONMENT=dev npm run test:playwright

# Staging environment (default)
npm run test:playwright

# UAT environment
ENVIRONMENT=uat npm run test:playwright
```

### Test Filtering

```bash
# Run tests by tag
npx playwright test --grep "@smoke"

# Run tests by title pattern
npx playwright test --grep "Transfer-In"

# Exclude specific tests
npx playwright test --grep-invert "@flaky"
```

## 👨‍💻 Test Development

### Writing Tests

```typescript
import { test, expect } from '@playwright/test';
import { ClientPortalPage } from '../pages/ClientPortalPage';

test.describe('Asset Transfer', () => {
  test('should complete transfer-in instruction @smoke', async ({ page }) => {
    const clientPortal = new ClientPortalPage(page);
    
    await clientPortal.navigateToTransfers();
    await clientPortal.createTransferIn({
      amount: '1000',
      sourceOfFunds: 'Investment proceeds'
    });
    
    await expect(page.locator('[data-testid="success-message"]'))
      .toBeVisible();
  });
});
```

### Page Object Model

```typescript
export class ClientPortalPage {
  constructor(private page: Page) {}

  async navigateToTransfers() {
    await this.page.click('[data-testid="transfers-menu"]');
    await this.page.waitForURL('**/transfers');
  }

  async createTransferIn(options: TransferOptions) {
    await this.page.fill('[data-testid="amount-input"]', options.amount);
    await this.page.selectOption('[data-testid="source-select"]', options.sourceOfFunds);
    await this.page.click('[data-testid="submit-button"]');
  }
}
```

### Test Data Management

```typescript
// fixtures/test-data.ts
export const TestData = {
  validUser: {
    username: 'test@example.com',
    password: 'SecurePass123!'
  },
  transferAmounts: {
    small: '100',
    medium: '1000',
    large: '10000'
  }
};
```

## 🔄 CI/CD Integration

### GitHub Actions

```yaml
name: Playwright Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run Playwright tests
        run: npm run test:playwright
        env:
          CP_USERNAME: ${{ secrets.CP_USERNAME }}
          CP_PASSWORD: ${{ secrets.CP_PASSWORD }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright/reports/
```

### Azure DevOps

```yaml
trigger:
- main

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: NodeTool@0
  inputs:
    versionSpec: '18'
    
- script: |
    npm ci
    npx playwright install --with-deps
  displayName: 'Install dependencies'

- script: npm run test:playwright
  displayName: 'Run Playwright tests'
  env:
    CP_USERNAME: $(CP_USERNAME)
    CP_PASSWORD: $(CP_PASSWORD)
    GITHUB_TOKEN: $(GITHUB_TOKEN)

- task: PublishTestResults@2
  inputs:
    testResultsFormat: 'JUnit'
    testResultsFiles: 'playwright/reports/junit/results.xml'
```

## 🐳 Docker Support

### Building and Running

```bash
# Build Docker image
docker build -t playwright-tests .

# Run tests in container
docker run --rm \
  --env-file playwright/.env \
  -e ENVIRONMENT=staging \
  playwright-tests

# Run with volume mounts for reports
docker run --rm \
  --env-file playwright/.env \
  -v $(pwd)/reports:/app/playwright/reports \
  playwright-tests
```

### Docker Compose

```yaml
version: '3.8'
services:
  playwright-tests:
    build: .
    environment:
      - ENVIRONMENT=staging
    env_file:
      - playwright/.env
    volumes:
      - ./reports:/app/playwright/reports
```

## 📁 Project Structure

```
Web_Automation_UI/
├── playwright/                      # 🚀 Modern Playwright Framework
│   ├── ClientPortal/
│   │   ├── tests/                    # Client Portal test files
│   │   ├── pages/                    # Page Object Models
│   │   ├── fixtures/                 # Test data and session files
│   │   └── utils/                    # Utility functions
│   ├── BackOffice/
│   │   ├── tests/                    # Back Office test files
│   │   ├── pages/                    # Page Object Models
│   │   └── utils/                    # Utility functions
│   ├── reports/                      # Test execution reports
│   ├── artifacts/                    # Screenshots, videos, traces
│   ├── global-setup.ts              # Global test setup
│   ├── playwright.config.ts         # Main configuration
│   └── .env                         # Environment variables
├── cypress/                         # 📜 Legacy Cypress Framework
│   ├── e2e/                         # End-to-end test files
│   ├── support/                     # Custom commands and utilities
│   ├── fixtures/                    # Test data and fixtures
│   └── cypress.config.*.ts          # Cypress configurations
├── docs/
│   ├── README.md                    # This file
│   ├── DOCKER.md                    # Docker usage guide
│   └── TESTING_WRAPPERS.md          # Component testing guide
├── package.json                     # Dependencies and scripts
├── Dockerfile                       # Container configuration
└── .dockerignore                    # Docker build optimization
```

> **🔄 Migration Note**: This repository contains both Playwright (modern) and Cypress (legacy) implementations, demonstrating a real-world framework migration. See the [Framework Migration](#-framework-migration) section for details.

## 📖 Best Practices

### Test Organization

- **Group related tests** using `test.describe()`
- **Use descriptive test names** that explain the expected behavior
- **Tag tests** appropriately (@smoke, @regression, @api)
- **Keep tests independent** - avoid dependencies between tests

### Locator Strategy

```typescript
// Prefer data-testid attributes
await page.click('[data-testid="submit-button"]');

// Use role-based selectors
await page.click('button:has-text("Submit")');

// Avoid fragile CSS selectors
// ❌ await page.click('.btn-primary.large');
// ✅ await page.click('[data-testid="primary-submit-btn"]');
```

### Assertions

```typescript
// Use specific assertions
await expect(page.locator('[data-testid="message"]'))
  .toHaveText('Success');

// Wait for conditions
await expect(page.locator('[data-testid="loader"]'))
  .toBeHidden();

// Soft assertions for multiple checks
await expect.soft(page.locator('#name')).toBeVisible();
await expect.soft(page.locator('#email')).toBeVisible();
```

### Error Handling

```typescript
test('should handle network failures gracefully', async ({ page }) => {
  // Simulate network conditions
  await page.route('**/api/**', route => route.abort());
  
  await page.goto('/transfers');
  
  await expect(page.locator('[data-testid="error-message"]'))
    .toBeVisible();
});
```

## 🔧 Troubleshooting

### Common Issues

#### Browser Installation Issues
```bash
# Clear browser cache and reinstall
npx playwright install --force

# Install system dependencies (Linux)
npx playwright install-deps
```

#### Environment Variable Issues
```bash
# Verify environment loading
node -e "require('dotenv').config({path: './playwright/.env'}); console.log(process.env.CP_BASE_URL);"
```

#### Test Timeout Issues
```typescript
// Increase timeout for specific test
test('slow operation', async ({ page }) => {
  test.setTimeout(120_000); // 2 minutes
  // ... test code
});
```

#### Debug Mode
```bash
# Run single test in debug mode
npx playwright test --debug transfer-in.spec.ts

# Generate trace files
npx playwright test --trace on
```

### Performance Optimization

- **Use `page.waitForLoadState()`** for reliable page loads
- **Implement proper wait strategies** instead of fixed delays
- **Optimize test data setup** using global setup
- **Use parallel execution** where appropriate

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-test-suite`
3. **Write tests following conventions**
4. **Run test suite**: `npm run test:playwright`
5. **Submit pull request**

### Code Standards

- **TypeScript**: Use strict type checking
- **ESLint**: Follow configured linting rules
- **Prettier**: Use for code formatting
- **Naming**: Use descriptive names for tests and functions

### Pull Request Checklist

- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No sensitive data in commits
- [ ] Code follows existing patterns

## 📞 Support

- **Issues**: Report bugs via GitHub Issues
- **Documentation**: Check `/docs` folder for additional guides
- **Playwright Docs**: [Official Playwright Documentation](https://playwright.dev/)

---

**Built with ❤️ using [Microsoft Playwright](https://playwright.dev/)**
