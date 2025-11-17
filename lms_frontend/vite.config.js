import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * PUBLIC_INTERFACE
 * Vite configuration for LMS frontend.
 * - Binds dev server to 0.0.0.0 on port 3000 with strictPort to prevent fallback.
 * - Configures HMR clientPort=3000 for environments where the public entry is on 3000.
 * - Preview also runs on 3000 to align with preview expectations.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,           // 0.0.0.0
    port: 3000,
    strictPort: true,
    open: false,
    hmr: {
      clientPort: 3000,
    },
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
  },
});
