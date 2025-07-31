'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  FaHome, FaIdCard, FaArchive, FaBookmark, FaTags, FaBars, FaTimes,
} from 'react-icons/fa';

interface HomeNavBarProps {
  styleVariant?: 'home' | 'default';
  isVisible?: boolean;
}

export default function HomeNavBar({ styleVariant = 'default', isVisible = true }: HomeNavBarProps) {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navbarClass =
    styleVariant === 'home'
      ? scrollY > 100
        ? 'bg-gray-900/90 backdrop-blur-md border-b border-gray-700/50 shadow-lg'
        : 'bg-gray-900/20 backdrop-blur-md border-b border-gray-700/30'
      : scrollY > 100
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg'
        : 'bg-white/80 dark:bg-gray-900/20 backdrop-blur-md border-b border-gray-200/30 dark:border-gray-700/30';

  const textColorClass = styleVariant === 'home'
    ? 'text-white'
    : scrollY > 100
      ? 'text-gray-800 dark:text-white'
      : 'text-gray-900 dark:text-white';

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    const handleLanguageChange = (event: CustomEvent<'en' | 'zh'>) => {
      setLanguage(event.detail);
    };
    window.addEventListener('languageChange', handleLanguageChange as EventListener);

    const savedLanguage = localStorage.getItem('language') as 'en' | 'zh' | null;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${navbarClass}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className={`font-bold text-lg tracking-wider transition-all duration-300 hover:text-blue-400 ${textColorClass}`}>
            GUAGUA'S BLOG
          </Link>
          <ul className="hidden md:flex items-center space-x-8">
            {[{
              href: '/', icon: FaHome, label: language === 'en' ? 'Home' : '首頁'
            }, {
              href: '/about', icon: FaIdCard, label: language === 'en' ? 'About' : '關於'
            }, {
              href: '/archives', icon: FaArchive, label: language === 'en' ? 'Archives' : '歸檔'
            }, {
              href: '/categories', icon: FaBookmark, label: language === 'en' ? 'Categories' : '分類'
            }, {
              href: '/tags', icon: FaTags, label: language === 'en' ? 'Tags' : '標籤'
            }].map(({ href, icon: Icon, label }) => (
              <li key={href}>
                <Link href={href} className={`group flex items-center gap-2 transition-colors duration-300 ${textColorClass} hover:text-blue-500`}>
                  <Icon className="transition-transform duration-200 group-hover:scale-110" size={16} />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            className={`md:hidden p-2 hover:text-blue-400 ${textColorClass}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-lg">
            <ul className="px-6 py-4 space-y-3">
              {[{
                href: '/', icon: FaHome, label: language === 'en' ? 'Home' : '首頁'
              }, {
                href: '/about', icon: FaIdCard, label: language === 'en' ? 'About' : '關於'
              }, {
                href: '/archives', icon: FaArchive, label: language === 'en' ? 'Archives' : '歸檔'
              }, {
                href: '/categories', icon: FaBookmark, label: language === 'en' ? 'Categories' : '分類'
              }, {
                href: '/tags', icon: FaTags, label: language === 'en' ? 'Tags' : '標籤'
              }].map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="group flex items-center gap-3 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <Icon className="group-hover:scale-110 transition-transform duration-200" size={16} />
                    <span className="font-medium">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
