
# Fix React Duplicate Instance Errors

## Problem
The console shows "Invalid hook call" errors with the message "Cannot read properties of null (reading 'useState')" and "Cannot read properties of null (reading 'useContext')". This is caused by **duplicate React instances** in the build.

The stack trace references line 36:69 in Index.jsx, but that file only has 34 lines - this indicates stale cached files from the TypeScript to JavaScript conversion are causing conflicts.

## Root Cause
After converting many files from `.tsx` to `.jsx`, Vite's dependency cache has become stale and is loading multiple copies of React. The current `vite.config.js` is minimal and lacks the necessary configuration to:
1. Force re-optimization of dependencies
2. Ensure a single React instance is used across all modules

## Solution
Update the Vite configuration to enforce React deduplication and force cache invalidation:

### File: vite.config.js
Add the following configuration:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Enforce single React instance
      "react": path.resolve(__dirname, "./node_modules/react"),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "./node_modules/react/jsx-dev-runtime"),
    },
  },
  optimizeDeps: {
    // Force re-optimization to clear stale cache
    force: true,
    include: ["react", "react-dom", "@tanstack/react-query"],
  },
  build: {
    rollupOptions: {
      output: {
        // Bundle React into a single chunk
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
        },
      },
    },
  },
}));
```

## Changes Summary
| Setting | Purpose |
|---------|---------|
| `resolve.alias` for React | Forces all imports to use the same React instance |
| `optimizeDeps.force: true` | Clears stale Vite cache from the TS to JS conversion |
| `optimizeDeps.include` | Pre-bundles React and related packages |
| `manualChunks` | Ensures React is bundled once for production builds |

## Expected Result
After this fix:
- The "Invalid hook call" errors will be resolved
- All hooks (useState, useContext, useQuery) will work correctly
- The app will render without crashing
