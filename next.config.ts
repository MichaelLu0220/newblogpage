import type { NextConfig } from 'next'
import withMDX from '@next/mdx'

const nextConfig: NextConfig = {
  eslint: {
    // 在生產構建時忽略 ESLint 錯誤
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 在生產構建時忽略 TypeScript 錯誤
    ignoreBuildErrors: true,
  },
}

export default withMDX({
  extension: /\.mdx?$/,
  options: {},
})({
  ...nextConfig,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
})