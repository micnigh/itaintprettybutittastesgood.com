# AGENTS.md

## Cursor Cloud specific instructions

### Product overview

Family recipe collection site (React SPA + static data). No backend, database, or Docker. Recipe data is bundled from `src/recipes.json` at build time; images live under `public/recipes/`.

### Required local artifact: `src/recipes.json`

`src/recipes.json` is **gitignored** and is **not** created by `pnpm install`. Without it, dev server, build, and most tests fail.

After `pnpm install`, regenerate it from committed per-recipe JSON under `public/recipes/`:

```bash
pnpm prepare-recipes
```

This runs automatically before `dev`, `build`, `typecheck`, and tests (`predev` / `prebuild` / `pretest` hooks in `package.json`).

To refresh data from Google Docs (optional), use `pnpm fetch-data` with `credentials.json` and `GEMINI_API_KEY` — see `README.md`.

### Site behavior (runtime)

Recipe list search (`src/utils/recipe.ts` → `filterRecipes`) matches **title and tags only** — not ingredients or markdown body text.

On a recipe page, servings scaling uses `useRecipeServings` (`src/hooks/useRecipeServings.ts`): metadata servings are parsed via the first number in the string (defaults to 1). Ingredient quantities scale by `servingsFraction / originalServings`. Small amounts auto-convert for display (`autoConvertUnits`: cups → tablespoons below ¼ cup; tablespoons → teaspoons below 1 tbsp).

### Services

| Service | Command | URL |
|---------|---------|-----|
| Vite dev server | `pnpm dev` | http://localhost:5173 |
| Vite preview | `pnpm preview` | http://localhost:4173 (default) |

Only the Vite dev server is required for local development and E2E. Playwright starts it automatically when running `pnpm test:e2e` outside CI.

### Common commands

See `package.json` scripts and `README.md`. Quick reference:

- **Lint:** `pnpm lint`
- **Typecheck:** `pnpm typecheck`
- **Unit tests:** `pnpm test:unit`
- **Integration tests:** `pnpm test:integration`
- **E2E tests:** `pnpm test:e2e:install` (first time), then `pnpm test:e2e`
- **Full validation:** `pnpm validate` (lint + typecheck + format + all tests)
- **Production build:** `pnpm build`

### E2E / Playwright

First E2E run needs browser binaries: `pnpm test:e2e:install`. E2E expects `src/recipes.json` to exist and uses Chromium locally (Firefox + WebKit in CI).

### Node version

`.nvmrc` specifies `lts/*`. Node 18+ is required per README.
