# Dockerfile for Playwright tests
FROM mcr.microsoft.com/playwright:v1.54.1-focal

# Set working directory
WORKDIR /app

# Set default environment
ENV ENVIRONMENT=staging

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Install Playwright browsers
RUN npx playwright install

# Copy project files
COPY . .

# Create reports directory
RUN mkdir -p playwright/reports

# Create an entrypoint script for Playwright tests
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "Starting Playwright tests on environment: $ENVIRONMENT"\n\
\n\
# Run Playwright tests\n\
npm run test:playwright\n\
\n\
echo "Playwright tests completed successfully"' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/app/entrypoint.sh"] 