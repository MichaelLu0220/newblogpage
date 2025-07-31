'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaFolderOpen } from 'react-icons/fa';
import NavBar from '@/components/NavBar';
import ThemeToggle from '@/components/ThemeToggle';
import { PostMeta } from '@/lib/posts';

interface Props {
  posts: PostMeta[];
}

export default function CategoryClient({ posts }: Props) {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const saved = localStorage.getItem('language') as 'en' | 'zh' | null;
    if (saved) setLanguage(saved);

    const handler = (e: CustomEvent<'en' | 'zh'>) => setLanguage(e.detail);
    window.addEventListener('languageChange', handler as EventListener);

    return () => {
      window.removeEventListener('languageChange', handler as EventListener);
    };
  }, []);

  if (!mounted) return null;

  const categoryMap: Record<string, PostMeta[]> = {};
  posts.forEach(post => {
    const category = post.categories || 'Uncategorized';
    if (!categoryMap[category]) categoryMap[category] = [];
    categoryMap[category].push(post);
  });

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <NavBar />

      {/* 背景泡泡 */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="w-[40rem] h-[40rem] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl mx-auto -mt-32" />
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 animate-fade-in">
        <h1 className="text-4xl font-bold mb-10 border-b border-gray-300 dark:border-gray-700 pb-3">
          {language === 'zh' ? '分類總覽' : 'All Categories'}
        </h1>

        <ul className="space-y-6">
          {Object.entries(categoryMap).map(([category, items]) => (
            <li key={category}>
              <Link
                href={`/categories/${encodeURIComponent(category)}`}
                className="flex items-center text-lg font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <FaFolderOpen className="mr-2" />
                {category} ({items.length})
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
