import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import TagClient from './TagClient';

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

export default function TagsPage() {
  const posts = getAllPosts();
  return <TagClient posts={posts} />;
}
