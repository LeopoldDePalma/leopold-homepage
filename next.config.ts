import type {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  experimental: {createMessagesDeclaration: './src/messages/en.json'},
});

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
    globalNotFound: true,
  },
  headers: () => [
    {
      source: '/:path*',
      headers: [{key: 'X-Content-Type-Options', value: 'nosniff'}],
    },
  ],
};

export default withNextIntl(nextConfig);
