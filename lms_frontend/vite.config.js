import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * PUBLIC_INTERFACE
 * Vite configuration for LMS frontend.
 * - Binds dev server to 0.0.0.0 on port 3000 with strictPort to prevent fallback.
 * - Configures HMR clientPort=3000 for environments where the public entry is on 3000.
 * - Preview also runs on 3000 to align with preview expectations.
 * - Adds allowedHosts for dev/preview to support remote hostnames indicated by the environment or error messages.
 */
export default defineConfig(() => {
  // Prefer env-based allowed hosts. Accept comma-separated list from ALLOWED_HOSTS.
  const envAllowed =
    (process?.env?.ALLOWED_HOSTS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  // Include the preview host; fall back to permissive '*' to prevent blank preview due to host mismatch.
  const reportedHost = 'vscode-internal-19782-beta.beta01.cloud.kavia.ai';

  // Merge and de-duplicate allowed hosts and include wildcard as last resort.
  const allowedHosts = Array.from(new Set([...(envAllowed || []), reportedHost, '*']));

  return {
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      strictPort: true,
      open: false,
      hmr: {
        clientPort: 3000,
      },
      allowedHosts,
    },
    preview: {
      host: true,
      port: 3000,
      strictPort: true,
      allowedHosts,
    },
  };
});
