# itaintprettybutittastesgood.com

Static site generator for a recipe collection. Recipes are stored in Google Docs and processed into a React-based static site.

## Requirements

- Node 18+
- pnpm

## Setup

```sh
# Install dependencies
pnpm install

# Configure Google Drive API access (see scripts/fetch-data.ts for setup instructions)
# Add credentials.json to project root

# Configure Gemini API (for ingredient parsing and image generation)
# Add GEMINI_API_KEY to .env file
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run all tests (unit, integration, e2e)
- `pnpm fetch-data` - Fetch and process recipes from Google Docs
- `pnpm fetch-data:clean` - Fetch data without using cache
- `pnpm validate` - Run lint, typecheck, format, and tests

## Troubleshooting

- Google Drive API setup: https://console.cloud.google.com/home/dashboard?project=itaintprettybutittastesgood
- Token generation issues: https://github.com/cedricdelpoux/gatsby-source-google-docs/issues/180#issuecomment-1175154112
