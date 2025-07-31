// ❌ 不要加 'use client'：這是 server component

import { getAllPosts } from '@/lib/posts';
import ArchiveClient from '@/app/archives/ArchiveClient';

export default function ArchivesPage() {
  const posts = getAllPosts(); // server-side 執行，不會碰到 fs 問題
  return <ArchiveClient posts={posts} />;
}
