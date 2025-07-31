'use client';

import { useEffect, useState, useRef } from 'react';

const images = [
    '/images/background0.jpg',
    '/images/background1.jpg',
    '/images/background2.jpg',
    '/images/background3.jpg',
    '/images/background4.jpg',
    '/images/background5.jpg',
    '/images/background6.jpg',
    '/images/background7.jpg',
];

function scrollToArticles() {
    const target = document.getElementById('articles');
    if (target) {
        const yOffset = -60;
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
}

export default function HeroBanner() {
    const [image, setImage] = useState(images[0]);
    const [language, setLanguage] = useState<'en' | 'zh'>('en');
    const [mounted, setMounted] = useState(false);
    const heroRef = useRef<HTMLDivElement>(null);

    // 處理點擊滑動
    const handleHeroClick = (e: React.MouseEvent) => {
        // 避免按鈕點擊觸發滑動
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }

        // 創建點擊漣漪效果
        const ripple = document.createElement('div');
        const rect = heroRef.current?.getBoundingClientRect();

        if (rect) {
            const size = 100;
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.8s ease-out;
                pointer-events: none;
                z-index: 25;
            `;

            heroRef.current?.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 800);
        }

        // 延遲滑動讓用戶看到點擊效果
        setTimeout(scrollToArticles, 150);
    };

    useEffect(() => {
        setMounted(true);
        const handleLanguageChange = (event: CustomEvent<'en' | 'zh'>) => {
            setLanguage(event.detail);
        };

        window.addEventListener('languageChange', handleLanguageChange as EventListener);

        const savedLanguage = localStorage.getItem('language') as 'en' | 'zh' | null;
        if (savedLanguage) setLanguage(savedLanguage);

        const idx = Math.floor(Math.random() * images.length);
        setImage(images[idx]);
        // 滾動視差效果
        const handleScroll = () => {
            if (heroRef.current) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                heroRef.current.style.transform = `translateY(${rate}px)`;
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('languageChange', handleLanguageChange as EventListener);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* 背景圖 */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105 hover:scale-110"
                style={{ backgroundImage: `url(${image})` }}
            />

            {/* 深色漸層 */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/1 via-black/30 to-black/60 z-0" />

            {/* 點擊整區滑動 (修復版本) */}
            <div
                className="absolute inset-0 z-10 cursor-pointer"
                onClick={scrollToArticles}
            >
                {/* invisible block to ensure clickable area exists */}
                <div className="w-full h-full" />
            </div>

            {/* 主內容 */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4 pointer-events-none">
                <div className="mb-8 space-y-6">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wide drop-shadow-2xl animate-fade-in leading-tight relative">
                        <span className="relative z-20">{language === 'en' ? "GuaGua's Blog" : 'GuaGua 的博客'}</span>
                    </h1>

                    <div className="w-24 h-1 bg-white/80 mx-auto rounded-full animate-expand" />
                    <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-light opacity-90 drop-shadow-lg max-w-5xl mx-auto leading-relaxed animate-slide-up">
                        {language === 'en'
                            ? 'Life, Technology, and a Bunch of Interesting Stories'
                            : '生活、技術，還有一些有趣的故事'}
                    </p>
                </div>
            </div>

            {/* Scroll 指示器 */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-30 pointer-events-none">
                <div className="flex flex-col items-center">
                    <div className="w-5 h-8 border-2 border-white/60 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                    </div>
                    <p className="text-sm text-white/30 mt-1 font-light">
                        {language === 'en' ? 'Click to scroll' : '點擊滾動'}
                    </p>
                </div>
            </div>

            {/* 背景切換按鈕 */}
            <button
                onClick={() => {
                    const idx = Math.floor(Math.random() * images.length);
                    setImage(images[idx]);
                }}
                className="absolute top-16 right-6 bg-black/20 backdrop-blur-sm text-white p-3 rounded-full border border-white/20 hover:bg-black/30 transition-all duration-300 z-30 hover:scale-110 hover:rotate-180"
                title="Change Background"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
            </button>

            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes expand {
          from { width: 0; opacity: 0; }
          to { width: 6rem; opacity: 1; }
        }

        @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }

        

        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
                opacity: 0.6;
            }
            25% {
                transform: translateY(-30px) rotate(90deg);
                opacity: 0.8;
            }
            50% {
                transform: translateY(-15px) rotate(180deg);
                opacity: 1;
            }
            75% {
                transform: translateY(-40px) rotate(270deg);
                opacity: 0.7;
            }
        }

        .animate-fade-in { 
            animation: fade-in 1.2s ease-out; 
        }
        
        .animate-slide-up { 
            animation: slide-up 1.5s ease-out 0.3s both; 
        }
        
        .animate-expand { 
            animation: expand 1s ease-out 0.6s both; 
        }

        

        .absolute.rounded-full:nth-child(odd) {
            animation-direction: reverse;
        }

        

        @keyframes bubble-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50%, 50%); }
        }
      `}</style>
        </div>
    );
}
