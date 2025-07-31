'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import ThemeToggle from '@/components/ThemeToggle';

interface PostMeta {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  slug: string;
}

interface Props {
  posts: PostMeta[];
}

export default function TagClient({ posts }: Props) {
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

  const tagMap: Record<string, number> = {};
  posts.forEach(post => {
    (post.tags || []).forEach(tag => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
  });

  const tags = Object.keys(tagMap).sort();

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <NavBar />

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="w-[40rem] h-[40rem] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl mx-auto -mt-32" />
      </div>

      <main className="max-w-3xl mx-auto pt-32 pb-24 px-6 animate-fade-in">
        <h1 className="text-4xl font-bold mb-10 border-b border-gray-300 dark:border-gray-700 pb-3">
          {language === 'zh' ? '標籤總覽' : 'All Tags'}
        </h1>

        <div className="flex flex-wrap gap-3 mb-8">
          {tags.map(tag => (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/70 transition text-sm font-medium"
            >
              #{tag} <span className="text-xs text-gray-500">({tagMap[tag]})</span>
            </Link>
          ))}
        </div>
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
