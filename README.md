# Meal Planner

A Next.js + Supabase meal planning module that lets households create and manage weekly meal plans, assign recipes, and view today's meals.

## Features
- Household selector derived from Supabase data
- Meal plan list with quick creation
- Calendar-style meal plan detail view with recipe picker
- Today summary panel
- REST-style API routes backed by Supabase
- Tailwind CSS UI with lightweight fetch-based data loading
- Vitest unit tests for core utilities and services

## Getting Started
1. Configure npm for your network (important behind a proxy)
   The helper script writes a project-local `.npmrc` with registry, proxy, and CA settings. It now ignores placeholder proxies like `http://proxy:8080` so installs do not fail with 403 errors when no valid proxy is available.
   ```bash
   ./scripts/configure-npm-registry.sh                 # uses https://registry.npmjs.org/ and no proxy by default
   # or explicitly set values (recommended if your network requires a proxy)
   # ./scripts/configure-npm-registry.sh https://registry.npmjs.org/ http://your-proxy:port
   ```
   If corporate env vars inject a non-working proxy, clear them for the install command:
   ```bash
   HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy= npm_config_http_proxy= npm_config_https_proxy= npm install
   ```
2. Install dependencies
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase project values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run the development server
   ```bash
   npm run dev
   ```
   Visit http://localhost:3000 to open the app.

5. Run tests
   ```bash
   npm test
   ```

### Dependency install tips
- The helper script skips placeholder proxies (e.g., `http://proxy:8080`); pass a real proxy URL as the second argument if your network requires one.
- If you see 403 responses from a proxy, try clearing `HTTP_PROXY`, `HTTPS_PROXY`, and `npm_config_*proxy` variables for the install command and re-run the script to regenerate `.npmrc` without proxy settings.
- The `.npmrc` written by the script is local to this project so it won't affect your global npm settings.

## Project Structure
- `app/` – Next.js App Router pages and API route handlers
- `components/` – UI components like shell, grids, and modals
- `lib/` – Supabase clients and domain services
- `types/` – Shared TypeScript types
- `styles/` – Tailwind global styles
- `tests/` – Vitest test suites

## Notes
- Supabase Auth is assumed; RLS ensures users only see their own household data.
- AI meal plan generation endpoint is stubbed and currently returns `501`.
