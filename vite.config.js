import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // Preact is API-compatible with React via preact/compat.
    // This cuts the react/react-dom runtime from ~44KB gzipped to ~4KB gzipped,
    // which directly reduces JS parse + execute time → lower TBT.
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
})
