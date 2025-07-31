'use client';

import { useEffect, useState } from 'react';
import NavBar from '@/components/NavBar';
import ThemeToggle from '@/components/ThemeToggle';

export default function AboutPage() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');

  useEffect(() => {
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

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* 頂部導航欄 */}
      <NavBar />

      {/* 背景裝飾泡泡 */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="w-[40rem] h-[40rem] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl mx-auto -mt-32"></div>
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-32 pb-24 animate-fade-in">
        <h1 className="text-4xl font-bold mb-10 border-b border-gray-300 dark:border-gray-700 pb-3">
          {language === 'en' ? 'About Me' : '關於我'}
        </h1>

        <section className="space-y-6 text-lg leading-relaxed">
          {language === 'en' ? (
            <>
              <p>
                Hello! I'm <strong>Michael Lu</strong>, also known as <strong>GuaGua</strong>. I'm a passionate software developer with experience in backend systems, web development, and rule engine platforms like IBM ODM.
              </p>
              <p>
                This blog is my digital notebook — a place to share thoughts, document learnings, and sometimes just talk about life.
              </p>
              <p>
                Built with <strong>Next.js</strong>, <strong>Tailwind CSS</strong>, and <strong>MDX</strong>, this site is statically generated and hand-written in markdown. Feel free to check the source on GitHub or reach out!
              </p>
            </>
          ) : (
            <>
              <p>
                哈囉！我是 <strong>Michael Lu</strong>，大家也叫我 <strong>GuaGua</strong>。我是一位熱愛技術的軟體工程師，擁有後端系統、網頁開發與 IBM ODM 規則引擎的開發經驗。
              </p>
              <p>
                這個部落格是我的數位筆記本，用來分享心得、記錄學習過程，也偶爾聊聊生活。
              </p>
              <p>
                本站使用 <strong>Next.js</strong>、<strong>Tailwind CSS</strong> 與 <strong>MDX</strong> 架構，所有文章皆手動撰寫並靜態部署。歡迎造訪我的 GitHub 或與我聯絡！
              </p>
            </>
          )}
        </section>
      </main>

      {/* 右下角功能列 */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* 動畫樣式 */}
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
