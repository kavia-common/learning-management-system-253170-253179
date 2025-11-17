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
  // If not provided, include the reported hostname required by the preview environment.
  const envAllowed =
    (process?.env?.ALLOWED_HOSTS || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

  // Always include the reported host so previews work out of the box.
  const reportedHost = 'vscode-internal-19782-beta.beta01.cloud.kavia.ai';

  // Merge and de-duplicate allowed hosts
  const allowedHosts = Array.from(new Set([...(envAllowed || []), reportedHost]));

  return {
    plugins: [react()],
    server: {
      // host: true binds to 0.0.0.0 and allows external access
      host: true,
      port: 3000,
      strictPort: true,
      open: false,
      // allow HMR from public endpoint
      hmr: {
        clientPort: 3000,
      },
      // Ensure the remote hostname is permitted by the dev server
      allowedHosts,
    },
    preview: {
      host: true,
      port: 3000,
      strictPort: true,
      // Ensure the remote hostname is permitted by the preview server as well
      allowedHosts,
    },
  };
});
