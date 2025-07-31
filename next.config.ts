import type { NextConfig } from 'next'
import withMDX from '@next/mdx'

const nextConfig: NextConfig = {}

export default withMDX({
  extension: /\.mdx?$/,
  options: {},
})({
  ...nextConfig,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
})