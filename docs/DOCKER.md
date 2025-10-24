# Docker Usage Guide

This project supports running Playwright tests in Docker containers.

## Prerequisites

### Installing Docker

If you get an error like "docker: The term 'docker' is not recognized", you need to install Docker first:

1. **Download Docker Desktop** from [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Install and restart** your computer
3. **Verify installation**: `docker --version`

### Alternative: Local Execution

If you prefer not to use Docker, you can run tests locally using npm scripts:

```bash
# Playwright tests
npm run test:playwright
npm run playwright:ui
npm run playwright:report
```

## Building the Docker Image

```bash
docker build -t playwright-tests .
```

## Running Tests

### Playwright Tests

```bash
# Run Playwright tests with default settings (staging environment)
docker run --rm playwright-tests

# Run with specific environment
docker run --rm \
  -e ENVIRONMENT=staging \
  playwright-tests

# Run on UAT environment
docker run --rm \
  -e ENVIRONMENT=uat \
  playwright-tests
```

## Environment Variables

| Variable | Description | Default | Options |
|----------|-------------|---------|---------|
| `ENVIRONMENT` | Environment to test against | `staging` | `staging`, `uat` |

## Accessing Test Reports

To access test reports, mount a volume:

```bash
# Mount reports directory to access Playwright reports
docker run --rm \
  -v $(pwd)/reports:/app/playwright/reports \
  playwright-tests
```

## Development

For development with live code changes:

```bash
docker run --rm \
  -v $(pwd):/app \
  -w /app \
  playwright-tests
```
