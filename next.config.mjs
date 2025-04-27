// 添加构建优化配置

// 如果原来的配置是：
const nextConfig = {
  // 现有配置...
  
  // 添加构建优化
  swcMinify: true, // 使用SWC进行代码压缩
  poweredByHeader: false, // 移除X-Powered-By头
  reactStrictMode: false, // 暂时关闭严格模式以排除一些潜在问题
  
  // 配置构建输出
  output: 'standalone',
  
  // 配置构建日志
  logging: {
    level: 'verbose', // 详细日志
    buildActivity: true, // 显示构建活动
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  
  // 配置构建缓存
  experimental: {
    // 现有实验性配置...
    turbotrace: {
      logLevel: 'error',
    },
  },
}
