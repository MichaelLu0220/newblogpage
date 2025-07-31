import { getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import CategoryDetailClient from './CategoryDetailClient';

interface Props {
  params: { category: string };
}

export default function CategoryPage({ params }: Props) {
  const posts = getAllPosts();
  const filtered = posts.filter(
    post => post.categories === decodeURIComponent(params.category)
  );

  if (!filtered.length) return notFound();

  return (
    <CategoryDetailClient
      posts={filtered}
      categoryName={decodeURIComponent(params.category)}
    />
  );
}
