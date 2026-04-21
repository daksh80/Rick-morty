# Rick and Morty Characters

A React app that fetches and displays characters from the Rick and Morty API with filtering, pagination, loading states, retry handling, and lightweight performance optimizations.

## Features

- Fetch and display characters from `https://rickandmortyapi.com/api/character`
- Character card component (`Character`) showing:
- name
- image
- status/species
- last known location
- Pagination support using the API `page` parameter
- Filter by status (`alive`, `dead`, `unknown`)
- Filter by name (debounced input)
- Skeleton loading state
- Error UI with retry action
- Request caching and retry support in custom hooks
- PWA files included (`manifest.webmanifest`, `sw.js`)

## Tech Stack

- React (via `preact/compat` alias in Vite for smaller runtime)
- Vite
- SCSS modules
- ESLint

## Project Structure

```txt
src/
  api/           # API layer
  components/    # Reusable UI components
  hooks/         # Reusable logic hooks (fetch/retry/debounce)
  pages/         # Page-level orchestration
  styles/        # Shared SCSS tokens/mixins
  utils/         # Constants and cache helpers
```

## How It Works

- `CharactersPage` manages page + filters and composes UI states.
- `useCharacters` is a domain hook that builds the request key and formats errors.
- `useFetch` handles cache-aware fetch, deduping in-flight calls, cancellation, and manual refetch.
- `useRetry` retries transient failures with exponential backoff.

## Run Locally

```bash
npm install
npm run dev
```

## Build and Preview

```bash
npm run build
npm run preview
```

## Quality Checks

```bash
npm run lint
```

## Notes

- This repository includes assignment-focused implementation and readability-first architecture.
- Additional architecture notes are available in [`read.md`](./read.md).
