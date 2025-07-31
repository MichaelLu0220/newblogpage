import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import TagDetailClient from './TagDetailClient';

interface PostMeta {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  slug: string;
}

function getAllPosts(): PostMeta[] {
  const postsDir = path.join(process.cwd(), 'posts');
  const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.mdx'));

  return files.map(filename => {
    const filePath = path.join(postsDir, filename);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return {
      title: data.title || filename.replace(/\.mdx$/, ''),
      date: typeof data.date === 'string' ? data.date : String(data.date),
      description: data.description || '',
      tags: data.tags || [],
      slug: filename.replace(/\.mdx$/, ''),
    };
  });
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const posts = getAllPosts();
  const { tag } = await params; // 等待 params 解析
  const decodedTag = decodeURIComponent(tag);
  const filtered = posts.filter(post => (post.tags || []).includes(decodedTag));

  return <TagDetailClient posts={filtered} tag={decodedTag} />;
}