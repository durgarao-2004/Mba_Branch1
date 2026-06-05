import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },

  /*
   * allowedDevOrigins — fixes Chrome external-browser interaction issues.
   *
   * Next.js 15+ introduced a host-check middleware that validates the `Origin`
   * header of every dev-server request against the server's own hostname.
   * VS Code's Simple Browser proxies through localhost so the check passes.
   * Chrome sends the real URL origin (127.0.0.1, machine hostname, LAN IP),
   * which fails the check → WebSocket / HMR blocked → React event handlers
   * behave inconsistently because the hydration error overlay interferes.
   *
   * This list covers every common local-development origin so Chrome, Safari,
   * and external mobile browsers all work without changing the URL.
   */
  allowedDevOrigins: [
    // loopback variants
    'localhost',
    '127.0.0.1',
    '::1',

    // wildcard sub-domains (e.g. app.localhost, next.localhost)
    '*.localhost',

    // mDNS .local names used on macOS and Linux
    '*.local',

    // If you access via your machine's network name or a LAN IP,
    // add it here — e.g. '192.168.1.100', 'my-macbook.local'
  ],
};

export default nextConfig;
