'use client';

import { useState, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import NavBar from '@/components/NavBar';
import CommentSection from '@/components/CommentSection';

interface PostData {
    title: string | { en: string; zh: string };
    date: string;
    category?: string;
    tags?: string[];
    content: string;
    readingTime: number;
    compiledSource?: any;
}

interface BlogClientContentProps {
    slug: string;
    postData: PostData;
    mdxContent: React.ReactElement;
}

export default function BlogClientContent({ slug, postData, mdxContent }: BlogClientContentProps) {
    const [language, setLanguage] = useState<'en' | 'zh'>('zh'); // 改為默認中文
    const [mounted, setMounted] = useState(false);

    // 語言文字對照
    const texts = {
        en: {
            readingTime: 'minute read',
            tags: 'Tags:',
            previousArticle: 'Previous Article',
            nextArticle: 'Next Article',
            previousTitle: 'Previous Article Title',
            nextTitle: 'Next Article Title',
            blogTitle: "GuaGua's Blog",
            blogSubtitle: 'Sharing tech, life and thoughts',
            copyright: '© 2022 - 2025 GuaGua\'s blog | Powered by Next.js & Tailwind CSS'
        },
        zh: {
            readingTime: '分鐘閱讀',
            tags: '標籤:',
            previousArticle: '上一篇文章',
            nextArticle: '下一篇文章',
            previousTitle: 'Previous Article Title',
            nextTitle: 'Next Article Title',
            blogTitle: "GuaGua's Blog",
            blogSubtitle: '分享技術、生活與思考',
            copyright: '© 2022 - 2025 GuaGua\'s blog | Powered by Next.js & Tailwind CSS'
        }
    };

    // 獲取當前語言的標題
    const getLocalizedTitle = () => {
        if (typeof postData.title === 'object') {
            return postData.title[language];
        }
        return postData.title;
    };

    // 切換語言內容顯示
    const toggleLanguageContent = (lang: 'en' | 'zh') => {
        const allContent = document.querySelectorAll('.language-content');
        allContent.forEach((element) => {
            const htmlElement = element as HTMLElement;
            if (htmlElement.dataset.lang === lang) {
                htmlElement.style.display = 'block';
            } else {
                htmlElement.style.display = 'none';
            }
        });
    };

    useEffect(() => {
        // 優先從 localStorage 讀取語言設置
        const savedLanguage = localStorage.getItem('language') as 'en' | 'zh' | null;
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
        
        setMounted(true);
    }, []);

    // 當 mounted 或 language 改變時，更新語言內容顯示
    useEffect(() => {
        if (mounted) {
            toggleLanguageContent(language);
        }
    }, [mounted, language]);

    // 監聽語言變更事件
    useEffect(() => {
        const handleLanguageChange = (event: CustomEvent<'en' | 'zh'>) => {
            setLanguage(event.detail);
        };

        window.addEventListener('languageChange', handleLanguageChange as EventListener);

        return () => {
            window.removeEventListener('languageChange', handleLanguageChange as EventListener);
        };
    }, []);

    // 防止水合錯誤
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">載入中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500">
            <NavBar />
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* Main content container */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-36">
                {/* Header section */}
                <header className="mb-8">
                    <div className="pb-8" />
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-8 leading-tight pb-1.5 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-left">
                        {getLocalizedTitle()}
                    </h1>
                    <div className="flex flex-wrap justify-left gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-left gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            <time dateTime={postData.date}>
                                {new Date(postData.date).toLocaleDateString(language === 'en' ? 'en-US' : 'zh-TW', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    weekday: 'short',
                                })}
                            </time>
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span>{postData.readingTime} {texts[language].readingTime}</span>
                        </div>
                        {postData.category && (
                            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                                <span>{postData.category}</span>
                            </div>
                        )}
                    </div>
                </header>

                {/* Article content */}
                <article className="prose prose-lg dark:prose-invert max-w-none
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-h1:text-3xl prose-h1:mt-10 prose-h1:mb-6
                    prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700
                    prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                    prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                    prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:decoration-blue-500
                    prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono
                    prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900 prose-pre:rounded-lg prose-pre:p-4 prose-pre:my-6
                    prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:my-6 prose-blockquote:italic
                    prose-ul:pl-6 prose-ol:pl-6 prose-li:mb-2
                    prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-700 prose-table:rounded-lg prose-table:my-6
                    prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3
                    prose-td:p-3 prose-td:border-t prose-td:border-gray-200 dark:prose-td:border-gray-700
                    prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
                    transition-colors duration-500">
                    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                        {mdxContent}
                    </div>
                </article>

                {/* Tags section */}
                {postData.tags && postData.tags.length > 0 && (
                    <div className="mt-12 bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md">
                        <div className="flex flex-wrap gap-3">
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">{texts[language].tags}</span>
                            {postData.tags.map((tag: string, index: number) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation links */}
                <div className="mt-12 grid sm:grid-cols-2 gap-6">
                    <a href="#" className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors">
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{texts[language].previousArticle}</span>
                            <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {texts[language].previousTitle}
                            </div>
                        </div>
                    </a>
                    <a href="#" className="group flex items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-colors justify-end">
                        <div className="text-right">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{texts[language].nextArticle}</span>
                            <div className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                {texts[language].nextTitle}
                            </div>
                        </div>
                        <svg className="w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </a>
                </div>

                {/* Comments section */}
                <div className="mt-16">
                    <CommentSection postSlug={slug} />
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-xl font-bold mb-2">{texts[language].blogTitle}</h3>
                    <p className="text-gray-400 mb-6">{texts[language].blogSubtitle}</p>
                    <p className="text-gray-500 text-sm">{texts[language].copyright}</p>
                </div>
            </footer>
        </div>
    );
}