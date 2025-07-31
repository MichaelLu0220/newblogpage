'use client';

import { useEffect, useRef, useState } from 'react';
import { FaCog, FaMoon, FaSun, FaHome, FaGlobe } from 'react-icons/fa';
import Link from 'next/link';
import { useLanguageDetection } from '@/utils/languageDetector';

export default function ThemeToggle() {
    const [dark, setDark] = useState(false); // 主題暗色狀態
    const [open, setOpen] = useState(false); // 功能按鈕是否開啟
    const [spin, setSpin] = useState(false); // 齒輪是否旋轉
    const [isAnimating, setIsAnimating] = useState(false); // 動畫是否進行中
    const { language, changeLanguage, mounted } = useLanguageDetection();
    const menuRef = useRef<HTMLDivElement>(null);
    const closeTimer = useRef<NodeJS.Timeout | null>(null);

    // 初始化主題 - 修復水合錯誤
    useEffect(() => {
        // 只在客戶端執行 localStorage 操作
        const isDark = localStorage.getItem('theme') === 'dark' ||
            (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        setDark(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    // 防止水合錯誤：組件未掛載時不渲染
    if (!mounted) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <div className="relative">
                    <button className="relative transition-all duration-300 ease-out bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-600 rounded-full p-3 focus:outline-none">
                        <FaCog size={22} />
                    </button>
                </div>
            </div>
        );
    }

    const toggleTheme = () => {
        const newDark = !dark;
        setDark(newDark);
        localStorage.setItem('theme', newDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', newDark);
    };

    const toggleLanguage = () => {
        const nextLang = language === 'en' ? 'zh' : 'en';
        changeLanguage(nextLang);
    };

    const handleOpen = () => {
        if (isAnimating || open) return;
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
        setIsAnimating(true);
        setSpin(true); // 展開時齒輪旋轉
        setOpen(true);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const handleClose = () => {
        if (isAnimating || !open) return;
        setIsAnimating(true);
        setSpin(true); // 收回時齒輪旋轉
        setOpen(false);
        setTimeout(() => setIsAnimating(false), 400);
    };

    const handleAnimationEnd = () => {
        setSpin(false);
    };

    const handleMouseEnter = () => {
        handleOpen();
    };

    const handleMouseLeave = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => {
            handleClose();
        }, 200);
    };

    return (
        <div
            ref={menuRef}
            className="fixed bottom-6 right-6 z-50"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative">
                {/* 功能按鈕群組 */}
                {(open || isAnimating) && (
                    <div className="flex flex-col items-center gap-3 mb-4">
                        <AnimatedButton
                            visible={open}
                            delay={0}
                            onClick={toggleTheme}
                            ariaLabel="切換主題"
                        >
                            {dark ? <FaSun size={20} /> : <FaMoon size={20} />}
                        </AnimatedButton>

                        <AnimatedButton
                            visible={open}
                            delay={100}
                            onClick={toggleLanguage}
                            ariaLabel="切換語言"
                        >
                            <div className="flex items-center">
                                <span className="text-base font-extrabold">{language === 'en' ? 'EN' : '中'}</span>
                            </div>
                        </AnimatedButton>

                        <AnimatedButton
                            visible={open}
                            delay={200}
                            isLink
                            href="/"
                            ariaLabel="回首頁"
                            onClick={handleClose}
                        >
                            <FaHome size={20} />
                        </AnimatedButton>
                    </div>
                )}

                {/* 齒輪按鈕 */}
                <div className="relative">
                    <button
                        className={`relative transition-all duration-300 ease-out bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-full p-3 focus:outline-none shadow-lg hover:shadow-xl transform hover:scale-105 ${spin ? 'animate-spin-smooth' : ''}`}
                        aria-label="設定選單"
                        onAnimationEnd={handleAnimationEnd}
                    >
                        <FaCog size={22} className="transition-transform duration-300" />
                    </button>
                </div>
            </div>

            {/* 動畫樣式區域 */}
            <style jsx global>{`
                @keyframes spin-smooth {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(180deg); }
                }

                @keyframes slideInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(20px) scale(0.8);
                    }
                    60% {
                        opacity: 0.8;
                        transform: translateY(-2px) scale(1.05);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes slideOutDown {
                    0% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(20px) scale(0.8);
                    }
                }

                .animate-slide-in {
                    animation: slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                .animate-slide-out {
                    animation: slideOutDown 0.4s ease forwards;
                }

                .animate-spin-smooth {
                    animation: spin-smooth 0.6s ease-in-out;
                }
            `}</style>
        </div>
    );
}

// 動畫按鈕元件
function AnimatedButton({
    visible,
    delay,
    children,
    onClick,
    ariaLabel,
    isLink = false,
    href = '/',
}: {
    visible: boolean;
    delay: number;
    children: React.ReactNode;
    onClick?: () => void;
    ariaLabel: string;
    isLink?: boolean;
    href?: string;
}) {
    const [showButton, setShowButton] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    // 控制進場與離場動畫
    useEffect(() => {
        if (visible) {
            setHasInteracted(true);
            setShowButton(true);
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, delay);
            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
            const hideTimer = setTimeout(() => {
                setShowButton(false);
            }, 400);
            return () => clearTimeout(hideTimer);
        }
    }, [visible, delay]);

    if (!showButton) return null;

    const animationClass = hasInteracted
        ? visible
            ? 'animate-slide-in'
            : 'animate-slide-out'
        : '';

    const baseClass = `w-12 h-12 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 transition-all duration-200 ease-out transform shadow-lg hover:shadow-xl hover:scale-105 ${animationClass}`;

    if (isLink) {
        return (
            <Link href={href} aria-label={ariaLabel} onClick={onClick} className={baseClass}>
                {children}
            </Link>
        );
    }

    return (
        <button onClick={onClick} aria-label={ariaLabel} className={baseClass}>
            {children}
        </button>
    );
}