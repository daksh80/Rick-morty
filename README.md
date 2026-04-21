Rick and Morty Characters App
                  End-to-End Architecture and Performance Documentation

1. Project Overview

This project is a React (Vite) single-page application that fetches characters from the Rick and Morty API and supports:

- Character listing
- Pagination
- Name-based filtering
- Status-based filtering
- Loading and error states
- Retry and caching strategies
- Progressive Web App behavior with offline support

The implementation is intentionally organized for readability and interview explainability while still using production-minded patterns for reliability and performance.

 2. Architecture at a Glance

The codebase follows a layered structure:
- `src/main.jsx`
Bootstrap, root render, and service worker registration.
- `src/App.jsx`
Application composition and top-level error boundary.
- `src/pages/CharactersPage/CharactersPage.jsx`
Page orchestration: local UI state, filter wiring, and conditional rendering.

- `src/hooks/*`
Reusable business logic:
- `useCharacters` domain-specific data hook
- `useFetch` generic cache-aware request hook
- `useRetry` retry strategy with exponential backoff
- `useDebounce` search input optimization

- `src/api/rickAndMorty.js`
HTTP-specific concerns: URL building, response normalization, first-load prefetch consumption.

- `src/components/*`
Presentation components:
- `Character`
- `CharacterList`
- `Filters`
- `Pagination`
- `CharacterSkeleton`
- `ErrorMessage`
- `ErrorBoundary`

- `src/utils/*`
Shared constants and in-memory TTL cache.

- `public/sw.js`, `public/manifest.webmanifest`
PWA and service-worker caching behavior.

## 3. End-to-End Runtime Flow

### 3.1 Initial Boot

1. Browser loads `index.html`.
2. Critical optimizations run before React:
- `preconnect` and `dns-prefetch` warm Rick & Morty API origin.
- LCP candidate image is preloaded.
- Minimal inline CSS prevents blank/jumpy first paint.
- `window.__rmPrefetch` starts first API request early.
3. `src/main.jsx` mounts React app.
4. Service worker is registered after page load.
5. `src/App.jsx` wraps the page in `ErrorBoundary`.

### 3.2 Page Initialization

`CharactersPage` initializes:

- `page` (default `1`)
- `nameInput` (default empty)
- `status` (default empty)
- `debouncedName` via `useDebounce` (400ms delay)

When debounced name changes, page resets to `1` so filtered results always start from first page.

### 3.3 Data Request Orchestration

`CharactersPage` calls:

`useCharacters({ page, name: debouncedName, status })`

Inside `useCharacters`:

1. A deterministic key is created:
`characters:${page}:${name}:${status}`
2. `useRetry` wraps the API request function.
3. `useFetch` handles:
- cache read
- loading/error/data states
- in-flight request deduplication
- cancellation
- manual refetch support
4. Error is mapped into user-friendly text.

### 3.4 API Layer Behavior

`fetchCharacters`:

- Builds URL with query params.
- Uses first-load prefetch (`window.__rmPrefetch`) once for default page.
- Performs `fetch` with `AbortController` signal.
- Handles response:
- `404` => `null` (no results state)
- other non-OK => throws error with status
- OK => returns JSON payload

### 3.5 Render Flow

The page renders in this order:

- `Filters` always visible
- `CharacterSkeleton` when `loading === true`
- `ErrorMessage` when `error` exists (with retry button)
- `CharacterList` when not loading and no error
- `Pagination` based on API `info.pages`

`CharacterList` maps character data into `Character` card components.
`Character` is memoized and uses image loading hints to reduce rendering cost.

## 4. State Management Strategy

The app uses local React state and custom hooks (no external state library):

- UI state in page component (`page`, `nameInput`, `status`)
- Derived state with `useDebounce`
- Request lifecycle state in `useFetch`
- Retry lifecycle state in `useRetry`

This keeps complexity low and assignment code easy to reason about.

## 5. Caching Strategy

Implemented in `src/utils/cache.js` + `useFetch`.

### 5.1 Cache Type

- In-memory `Map` store (module singleton)
- TTL-based expiration (default 5 minutes)
- Lazy eviction on read

### 5.2 Cache Key

- Keyed by query tuple (`page`, `name`, `status`)
- Prevents data collisions across filter combinations

### 5.3 In-flight Deduplication

`useFetch` stores active promises in `inflightRequests`.
If multiple consumers request the same key simultaneously, they share one network request.

## 6. Retry and Failure Strategy

`useRetry` provides exponential backoff with:

- Configurable retries (`maxRetries`)
- Base delay and multiplier (`backoff`)
- Retry only for transient cases:
- network-like failures
- `408`, `429`
- `>= 500`
- Abort-aware cancellation handling

This improves resilience without retrying permanent client-side errors unnecessarily.

## 7. Error Handling Strategy

Two layers:

1. Request-level errors (`useFetch` / `useCharacters`)
- Rendered via `ErrorMessage` with retry action.

2. Render/runtime exceptions (`ErrorBoundary`)
- Captures component tree crashes and shows fallback UI.
- Logs through `onError` callback in `App`.

## 8. PWA and Offline Strategy

### 8.1 Manifest

`manifest.webmanifest` configures installable app metadata:

- name, short name
- start URL
- display mode
- theme and background colors
- app icon

### 8.2 Service Worker (`public/sw.js`)

Three cache buckets:

- `APP_SHELL_CACHE`
- `ASSET_CACHE`
- `API_CACHE`

Fetch strategies:

- Navigation requests: `network-first` with app-shell fallback.
- API requests (`rickandmortyapi.com`): `network-first`, fallback to cached API response.
- Static assets: `stale-while-revalidate`.

Versioned caches are cleaned up in `activate`.

### 8.3 Practical Offline Behavior

- App shell can still load offline after first successful visit.
- Previously fetched API pages/queries can be served from cache.
- Brand-new unseen query combinations may not work offline.

## 9. Core Web Vitals Optimization Strategies

This codebase includes several targeted optimizations:

### 9.1 LCP (Largest Contentful Paint)

- `preconnect` and `dns-prefetch` for API origin (`index.html`)
- preload first likely hero image
- early first API request (`window.__rmPrefetch`) to overlap network with JS load
- eager/high-priority loading for first visible card image

### 9.2 INP (Interaction to Next Paint)

- debounced name filter to reduce input-triggered fetch storms
- memoized `Character` card to reduce unnecessary re-renders
- simple local state model avoids heavy global recomputation

### 9.3 TBT / Main-thread blocking

- React aliased to `preact/compat` in `vite.config.js` to reduce bundle parse/execute cost
- in-memory cache avoids repeated parsing/render churn from repeated requests
- loading skeletons provide immediate visual response while async work finishes

### 9.4 CLS (Cumulative Layout Shift)

- explicit image width/height on character cards
- stable card layout and skeleton placeholders

## 10. Security and Reliability Considerations

- Uses browser-native fetch and explicit response handling.
- Handles non-OK responses and avoids silent failures.
- Supports aborting stale requests to prevent race-condition UI updates.
- Uses deterministic cache keys and scoped caches.

## 11. Scalability Discussion (What to Improve Next)

If this app grows, recommended upgrades:

- Add TypeScript types for API contracts and hook results.
- Add unit/integration tests (Vitest + React Testing Library).
- Replace custom data layer with TanStack Query / SWR for advanced cache invalidation.
- Add analytics and real-user monitoring for Core Web Vitals.
- Add more explicit offline UX messages for cache-hit/miss situations.

## 12. Summary

The app is designed with a practical, maintainable architecture:

- clear separation of UI, data, and transport concerns
- robust fetch strategy (cache + dedupe + retry + cancellation)
- offline-aware PWA behavior
- concrete Core Web Vitals-oriented optimizations

This gives a strong assignment-grade implementation with production-minded foundations while remaining easy to explain in an interview.
