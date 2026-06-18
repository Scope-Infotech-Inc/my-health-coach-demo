import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // better-sqlite3 is a native addon; keep it external to the server bundle.
  serverExternalPackages: ['better-sqlite3'],
  // Test harnesses may isolate build output (never share .next between
  // concurrent next processes — it corrupts the dev server).
  distDir: process.env.HTEAP_DIST_DIR || '.next',
};

export default nextConfig;
