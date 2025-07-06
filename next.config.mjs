/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: false,
  },
  // Allow large file loading and specify video as an allowed asset
  assetPrefix: process.env.NODE_ENV === 'production' ? '/' : '',
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

    // Add support for video files
    config.module.rules.push({
      test: /\.(mp4|webm|ogg)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/media/',
          outputPath: 'static/media/',
          name: '[name].[hash].[ext]',
          esModule: false, // This fixes issues with video sources in production
        },
      },
    });

    return config;
  },
  async rewrites() {
    // Only add rewrites for development - Vercel doesn't need them
    if (process.env.NODE_ENV === 'development') {
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
    }
    return [];
  },
  // Vercel deployment optimizations
  output: 'standalone',
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  },
}

export default nextConfig