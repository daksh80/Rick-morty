/**
 * Simple in-memory cache with TTL.
 *
 * Module-level singleton so cached entries survive component unmount/remount.
 * Entries are lazily evicted on read — no background timer needed.
 */

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes
const store = new Map();

export const cacheRead = (key) => {
  const entry = store.get(key);
  if (!entry) return { hit: false, value: null };
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return { hit: false, value: null };
  }
  return { hit: true, value: entry.value };
};

export const cacheGet = (key) => {
  const { value, hit } = cacheRead(key);
  return hit ? value : null;
};

export const cacheSet = (key, value, ttl = DEFAULT_TTL) => {
  store.set(key, { value, expiresAt: Date.now() + ttl });
};

export const cacheDelete = (key) => store.delete(key);
export const cacheClear = () => store.clear();
