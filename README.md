Overview

This project is a Playwright automation framework built using JavaScript and the Page Object Model (POM) design pattern.

The framework is designed to support scalable, maintainable, and reusable UI automation testing.

Technology Stack
Playwright
JavaScript
Node.js
GitHub Actions
Playwright MCP
Framework Structure
pages/      - Page Object classes
tests/      - Test scripts
utils/      - Reusable utilities and constants
.github/    - GitHub Actions workflows
Prerequisites
Node.js installed
npm installed
Installation
npm install
npx playwright install
Running Tests

Run all tests:

npx playwright test

Run a specific test:

npx playwright test tests/login.spec.js
Reports

View Playwright HTML report:

npx playwright show-report
CI/CD

GitHub Actions is configured to:

Install dependencies
Install Playwright browsers
Execute Playwright tests
Generate execution results
AI-Driven Automation

This project explores AI-assisted test automation using Playwright MCP and GitHub-based workflows.