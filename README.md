# Apex Protocol v5.1

AI-Powered Startup Idea Generation and Analysis Platform

## Overview

Apex Protocol is a command center-style web application for generating and analyzing startup ideas using AI. It features a tactical interface for idea generation, market analysis, pitch deck creation, and adversarial testing.

## Features

- **Idea Generation**: Generate startup ideas with customizable parameters
- **Market Analysis**: Detailed analysis of market opportunities and challenges
- **Pitch Deck Generator**: Automatically create VC-ready pitch decks
- **War Room**: Adversarial AI analysis to identify vulnerabilities
- **Council Uplink**: Chat with specialized AI agents for targeted insights

## Development

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
npm install
```

### Running Locally

```bash
# Run both client and server in development mode
npm run dev

# Or run them separately
npm run client:dev  # Client only (port 3000)
npm run server:dev  # Server only (port 3001)
```

### Building

```bash
npm run build
```

This builds the client application to the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Deployment

This project is automatically deployed to GitHub Pages on every push to the `main` branch.

### GitHub Pages Setup

The deployment is handled by GitHub Actions (`.github/workflows/deploy.yml`). To enable deployment:

1. Go to your repository's Settings > Pages
2. Under "Source", select "GitHub Actions"
3. The workflow will automatically deploy on every push to `main`

### Deployment Workflow

The workflow performs the following steps:
1. Checks out the code
2. Sets up Node.js 20
3. Installs dependencies with `npm ci`
4. Builds the project with `npm run build`
5. Uploads the `dist/` folder as a GitHub Pages artifact
6. Deploys to GitHub Pages

### Manual Deployment

If you need to deploy manually or to a different platform:

```bash
npm run build
# Then deploy the contents of the dist/ folder to your hosting provider
```

## Configuration

### API Keys

The application requires a Gemini API key for AI functionality:

1. Click the settings icon in the top navigation
2. Enter your Gemini API key
3. Click "Save Key"

The API key is stored in your browser's local storage.

## Project Structure

```
apex-protocol/
├── client/              # Frontend application
│   ├── src/            # Source files
│   └── index.html      # Main HTML file
├── server/             # Backend API
│   └── src/           # Server source files
├── dist/              # Built files (generated)
├── .github/
│   └── workflows/     # GitHub Actions workflows
├── package.json       # Project dependencies
└── vite.config.js     # Vite configuration
```

## Technologies

- **Frontend**: Vite, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express
- **AI**: Google Gemini API
- **Deployment**: GitHub Pages, GitHub Actions

## License

See repository for license information.
