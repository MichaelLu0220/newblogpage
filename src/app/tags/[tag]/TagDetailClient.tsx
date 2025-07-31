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
  tag: string;
}

export default function TagDetailClient({ posts, tag }: Props) {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [mounted, setMounted] = useState(false);

  const getText = (text: string | { en: string; zh: string }): string => {
    return typeof text === 'string' ? text : text[language] ?? text.en;
  };

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

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <NavBar />

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="w-[40rem] h-[40rem] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl mx-auto -mt-32" />
      </div>

      <main className="max-w-3xl mx-auto pt-32 pb-24 px-6 animate-fade-in">
        <h1 className="text-4xl font-bold mb-10 border-b border-gray-300 dark:border-gray-700 pb-3">
          {language === 'zh' ? '標籤' : 'Tag'}：{tag}
        </h1>

        <ul className="space-y-6">
          {posts.map(post => (
            <li key={post.slug} className="border-b pb-4 border-gray-200 dark:border-gray-700">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  {getText(post.title)}
                </h2>
              </Link>
              <p className="text-gray-500 text-sm">{post.date}</p>
              {post.description && <p className="mt-1 text-gray-600 dark:text-gray-300">{getText(post.description)}</p>}
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Link href="/tags" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
            ← {language === 'zh' ? '回到所有標籤' : 'Back to All Tags'}
          </Link>
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
