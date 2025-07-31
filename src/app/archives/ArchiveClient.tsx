'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaCalendarAlt } from 'react-icons/fa';
import NavBar from '@/components/NavBar';
import ThemeToggle from '@/components/ThemeToggle';
import { PostMeta } from '@/lib/posts';

interface Props {
  posts: PostMeta[];
}

export default function ArchiveClient({ posts }: Props) {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleLangChange = (e: CustomEvent<'en' | 'zh'>) => {
      setLanguage(e.detail);
    };

    window.addEventListener('languageChange', handleLangChange as EventListener);
    const saved = localStorage.getItem('language') as 'en' | 'zh' | null;
    if (saved) setLanguage(saved);

    return () => {
      window.removeEventListener('languageChange', handleLangChange as EventListener);
    };
  }, []);

  const getText = (text: string | { en: string; zh: string }) => {
    return typeof text === 'string' ? text : text[language] ?? text.en;
  };

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      <NavBar />
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="w-[40rem] h-[40rem] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl mx-auto -mt-32"></div>
      </div>

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 animate-fade-in">
        <h1 className="text-4xl font-bold mb-10 border-b border-gray-300 dark:border-gray-700 pb-3">
          {language === 'en' ? 'Archives' : '歸檔'}
        </h1>

        <ul className="space-y-6">
          {posts.map(post => (
            <li
              key={post.slug}
              className="flex items-start gap-4 border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 min-w-[140px]">
                <FaCalendarAlt className="mr-2" />
                {new Date(post.date).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                })}
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {getText(post.title)}
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
