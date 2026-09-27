import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Chakra is not on Next's default list; this keeps its barrel import from pulling in every
    // component.
    optimizePackageImports: ['@chakra-ui/react'],
  },
  // The Content-Security-Policy is set per request in `src/proxy.ts`, where the nonce is made.
  headers: () => {
    return [
      {
        source: '/:path*',
        // Files are taken for the type they are served as, never sniffed into a script.
        headers: [{key: 'X-Content-Type-Options', value: 'nosniff'}],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
