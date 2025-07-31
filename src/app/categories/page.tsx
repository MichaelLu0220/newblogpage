import { getAllPosts } from '@/lib/posts';
import CategoryClient from '@/app/categories/CategoryClient';
export default function CategoriesPage() {
  const posts = getAllPosts();
  return <CategoryClient posts={posts} />;
}
