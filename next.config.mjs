/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_OPENCAGE_KEY: process.env.NEXT_PUBLIC_OPENCAGE_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },  images: {
    unoptimized: true,
  },
  // Allow large file loading and specify video as an allowed asset
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@splinetool/runtime': '@splinetool/runtime'
    };
    return config;
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  webpack: (config, { isServer }) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx']
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    config.resolve.byDependency = {
      ...config.resolve.byDependency,
      esm: {
        conditionNames: ['import', 'module', 'require', 'default']
      }
    };

    config.externals = [
      ...(config.externals || []),
      {
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
      }
    ];

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/ai/:path*',
        destination: 'http://localhost:8003/v1/:path*',
      },
      {
        source: '/api/health',
        destination: 'http://localhost:8003/health',
      }
    ];
  },
}

export default nextConfig
