'use client';

import Link from 'next/link';
import { FaGithub, FaHome, FaIdCard, FaArchive, FaBookmark, FaTags, FaCalendarAlt, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

import HeroBanner from '@/components/HeroBanner';
import ThemeToggle from '@/components/ThemeToggle';
import HomeNavBar from '@/components/HomeNavBar';
import { useEffect, useState } from 'react';
import { useLanguageDetection } from '@/utils/languageDetector';

interface PostMeta {
    title: string | { en: string; zh: string }; // 更新這裡支援雙語
    date: string;
    description?: string | { en: string; zh: string }; // 也支援雙語描述
    categories?: string;
    tags?: string[];
    slug: string;
}

interface ClientHomePageProps {
    posts: PostMeta[];
}

export default function ClientHomePage({ posts }: ClientHomePageProps) {
    const { language, mounted } = useLanguageDetection();
    const [scrollY, setScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 獲取當前語言的文本
    const getLocalizedText = (text: string | { en: string; zh: string } | undefined): string => {
        if (!text) return '';
        if (typeof text === 'string') return text;
        return text[language] || text.en || '';
    };

    // 監聽滾動事件
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 防止水合錯誤：組件未掛載時顯示預設內容
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
                <HomeNavBar styleVariant="home" />
                <HeroBanner />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    // 根據滾動位置決定導航欄樣式 - 改為深色風格
    const navbarClass = scrollY > 100
        ? "bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50 shadow-lg"
        : "bg-gray-900/20 backdrop-blur-md border-b border-gray-700/30";

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            {/* 更新的導航欄 - 深色風格 */}
            <HomeNavBar styleVariant="home" />

            {/* Hero Banner */}
            <HeroBanner />

            {/* 漸變過渡區域 */}
            <div className="relative -mt-8 z-10">
                <div className="h-8 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-50 dark:via-gray-900/50 dark:to-gray-900"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-20 bg-gray-50 dark:bg-gray-900" id="articles">
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Article List */}
                        <main className="lg:col-span-2">
                            <div className="space-y-8">
                                {posts.map((post, index) => (
                                    <article
                                        key={post.slug}
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transform hover:-translate-y-1"
                                        style={{
                                            animationDelay: `${index * 0.1}s`
                                        }}
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                                {post.categories && (
                                                    <Link href={`/categories/${post.categories.toLowerCase()}`} className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-300 text-xs font-medium">
                                                        <FaBookmark size={10} />
                                                        {post.categories}
                                                    </Link>
                                                )}
                                                <span className="flex items-center gap-1 text-xs">
                                                    <FaCalendarAlt size={10} />
                                                    {new Date(post.date).toLocaleDateString('zh-TW', {
                                                        year: 'numeric',
                                                        month: '2-digit',
                                                        day: '2-digit'
                                                    })}
                                                </span>
                                            </div>

                                            <Link href={`/blog/${post.slug}`} className="block group">
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight line-clamp-2">
                                                    {getLocalizedText(post.title)}
                                                </h2>
                                            </Link>

                                            {post.description && (
                                                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                                                    {getLocalizedText(post.description)}
                                                </p>
                                            )}

                                            {Array.isArray(post.tags) && post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {post.tags.slice(0, 4).map(tag => (
                                                        <Link
                                                            key={tag}
                                                            href={`/tags/${tag.toLowerCase()}`}
                                                            className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105"
                                                        >
                                                            #{tag}
                                                        </Link>
                                                    ))}
                                                    {post.tags.length > 4 && (
                                                        <span className="text-gray-400 text-xs px-2 py-1">
                                                            +{post.tags.length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-all duration-300 group"
                                            >
                                                {language === 'en' ? 'Read more' : '閱讀更多'}
                                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </main>

                        {/* Enhanced Sidebar */}
                        <aside className="space-y-6">
                            {/* Profile Card */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                                <div className="text-center">
                                    <div className="relative inline-block mb-4">
                                        <img
                                            src="/images/cat.jpg"
                                            alt="Michael Lu Avatar"
                                            className="w-20 h-20 rounded-full mx-auto border-4 border-gray-200 dark:border-gray-600 shadow-lg"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Michael Lu</h3>
                                    <p className="text-blue-600 dark:text-blue-400 mb-4 font-medium">a.k.a. GuaGua</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                                        {language === 'en'
                                            ? 'A personal blog sharing tech insights, life stories, and interesting moments'
                                            : '分享技術文章、生活故事與有趣經歷的部落格'
                                        }
                                    </p>
                                    <div className="flex justify-center">
                                        <a
                                            href="https://github.com/MichaelLu0220"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:scale-110 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                                            aria-label="GitHub Profile"
                                        >
                                            <FaGithub size={24} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Posts */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                    {language === 'en' ? 'Recent Posts' : '最新文章'}
                                </h3>
                                <div className="space-y-3">
                                    {posts.slice(0, 5).map(post => (
                                        <Link
                                            key={post.slug}
                                            href={`/blog/${post.slug}`}
                                            className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-relaxed p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 line-clamp-2"
                                        >
                                            {getLocalizedText(post.title)}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                    {language === 'en' ? 'Statistics' : '統計資訊'}
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            {language === 'en' ? 'Total Posts' : '文章總數'}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">{posts.length}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            {language === 'en' ? 'Categories' : '分類數量'}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {new Set(posts.map(post => post.categories).filter(Boolean)).size}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-300">
                                            {language === 'en' ? 'Tags' : '標籤總數'}
                                        </span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {new Set(posts.flatMap(post => post.tags || [])).size}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

            {/* Enhanced Footer */}
            <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12 mt-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold mb-2">GuaGua's Blog</h3>
                            <p className="text-gray-400">
                                {language === 'en'
                                    ? 'Thanks for reading! See you in the next post.'
                                    : '感謝閱讀！我們下篇文章見。'
                                }
                            </p>
                        </div>
                        <div className="border-t border-gray-700 pt-6">
                            <p className="text-gray-400">
                                © 2022 - 2025 GuaGua's blog | Powered by Next.js ❤️
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
            {/* 右下角固定 ThemeToggle 按鈕 */}
            <div className="fixed bottom-6 right-6 z-50">
                <ThemeToggle />
            </div>

            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>

        </div>
    );
}