# Rick and Morty Characters App

## 1. Architecture Design

This project follows a simple feature-based React structure with clear separation of concerns:

- `src/pages/` contains page-level orchestration logic.
- `src/components/` contains reusable UI components.
- `src/hooks/` contains reusable state and data-fetching logic.
- `src/api/` contains API request helpers.
- `src/utils/` contains constants and cache utilities.

The goal was to keep the code readable and interview-friendly while still handling common real-world UI states.

## 2. Main Data Flow

1. `CharactersPage` holds page state:
- current page
- search text
- selected status

2. `useCharacters` builds the request key from page + filters and delegates fetching to `useFetch`.

3. `useFetch` handles:
- cache lookup
- loading/error/data state
- in-flight deduplication
- cancellation and manual refetch

4. The page renders:
- `Filters` for name/status
- `CharacterSkeleton` during loading
- `ErrorMessage` on failures
- `CharacterList` for data
- `Pagination` for page navigation

## 3. Functionalities Implemented

- Fetch characters from Rick and Morty API.
- Show character cards with:
- name
- image
- status/species
- last known location
- Pagination using API `page` param.
- Filter by status (`alive`, `dead`, `unknown`).
- Filter by name (debounced input).
- Loading skeleton UI.
- Error state with retry button.
- In-memory cache with TTL.
- Retry with exponential backoff for transient failures.
- Basic request deduping to avoid duplicate calls.

## 4. Performance and UX Decisions

- Debounced search to reduce unnecessary API calls while typing.
- Cache-by-request-key to improve responsiveness on repeated queries.
- Skeleton loading for perceived performance.
- Memoized `Character` card component to avoid unnecessary re-renders.
- Image loading optimizations (`loading`, `decoding`, `fetchpriority`).

## 5. PWA / Offline Notes

The project includes PWA files and service worker setup:

- `public/manifest.webmanifest`
- `public/sw.js`

Offline behavior works best for data that was already visited and cached while online.

## 6. How to Run

Install and run locally:

```bash
npm install
npm run dev
```

Build and preview production:

```bash
npm run build
npm run preview
```

## 7. Possible Next Improvements

- Add TypeScript for stronger type safety.
- Add unit/component tests (Vitest + React Testing Library).
- Add real-user monitoring for performance.
- Move to a dedicated data library (TanStack Query / SWR) for larger-scale apps.
