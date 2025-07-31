import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  title: string | { en: string; zh: string };
  date: string;
  description?: string;
  categories?: string;
  tags?: string[];
  slug: string;
}

export function getAllPosts(): PostMeta[] {
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
      categories: data.categories || '',
      tags: data.tags || [],
      slug: filename.replace(/\.mdx$/, ''),
    };
  }).sort((a, b) => b.date.localeCompare(a.date));
}