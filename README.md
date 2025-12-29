# itaintprettybutittastesgood.com

Static site generator for a recipe collection. Recipes are stored in Google Docs and processed into a React-based static site.

## Requirements

- Node 18+
- pnpm

## How It Works

The system fetches recipes from Google Docs, processes them, and generates a static React site:

1. **Fetch**: Google Docs are retrieved from a shared Google Drive folder using the Google Drive/Docs APIs
2. **Process**: Each document is parsed, extracting:
   - Text content (converted to Markdown)
   - Images (downloaded and saved locally)
   - Ingredients (parsed with Gemini AI into structured data)
   - Metadata (from YAML in the document description)
3. **Generate**: If no images are found in a recipe, a hero image is generated using Gemini AI
4. **Build**: All processed recipes are combined into a single JSON file and the React site is built

## Setup

### 1. Install Dependencies

```sh
pnpm install
```

### 2. Configure Google Drive API Access

1. Create a service account and credentials by following the [Google Workspace credentials guide](https://developers.google.com/workspace/guides/create-credentials)
2. Download the credentials JSON file and save it as `credentials.json` in the project root
3. Enable the Google Docs API and Google Drive API in your Google Cloud project
4. Share your Google Drive folder (containing recipe documents) with the service account's email address
5. Update the `FOLDER_ID` in `scripts/fetch-data/config.ts` with your Google Drive folder ID (found in the folder URL: `.../folders/THIS_IS_THE_ID`)

### 3. Configure Gemini API

The Gemini API is used for ingredient parsing and image generation:

1. Enable the Gemini API in your Google Cloud project
2. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
3. Create a `.env` file in the project root:
   ```
   GEMINI_API_KEY="YOUR_API_KEY_HERE"
   ```

## Scripts

### Development
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally

### Data Processing
- `pnpm fetch-data` - Fetch and process recipes from Google Docs (uses cache)
- `pnpm fetch-data:clean` - Fetch data without using cache (forces full reprocessing)

### Testing
- `pnpm test` - Run all tests (unit, integration, e2e)
- `pnpm test:unit` - Run unit tests only
- `pnpm test:integration` - Run integration tests only
- `pnpm test:e2e` - Run end-to-end tests
- `pnpm test:e2e:ui` - Run e2e tests with Playwright UI
- `pnpm test:e2e:report` - Show Playwright test report

### Code Quality
- `pnpm validate` - Run lint, typecheck, format, and tests
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier

### Deployment
- `pnpm deploy` - Build and deploy to GitHub Pages

## Troubleshooting

### Google Drive API Setup

- **Console**: [Google Cloud Console](https://console.cloud.google.com/home/dashboard?project=itaintprettybutittastesgood)
- **Credentials not found**: Ensure `credentials.json` is in the project root with the correct service account credentials
- **Folder access denied**: Make sure you've shared the Google Drive folder with the service account email address (found in `credentials.json`)
- **No documents found**: Verify the `FOLDER_ID` in `scripts/fetch-data/config.ts` matches your folder ID and that it contains Google Docs files

### Token Generation Issues

If you encounter token generation issues, refer to: [gatsby-source-google-docs troubleshooting](https://github.com/cedricdelpoux/gatsby-source-google-docs/issues/180#issuecomment-1175154112)

### Gemini API Issues

- **Missing API key**: Ensure `GEMINI_API_KEY` is set in your `.env` file
- **Rate limits**: The system uses rate-limited queues to respect API limits. If you hit limits, processing will slow down automatically
- **Image generation fails**: If image generation fails, recipes will still be processed but without hero images

### Cache Issues

If recipes aren't updating after changes in Google Docs:
- Run `pnpm fetch-data:clean` to force a full reprocessing
- Check that the Google Docs modification time has actually changed
