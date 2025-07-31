// utils/languageDetector.ts
import { useEffect, useState } from 'react';

export function detectBrowserLanguage(): 'en' | 'zh' {
  // 檢查是否為客戶端環境
  if (typeof window === 'undefined') {
    return 'en'; // 服務端預設返回英文
  }

  // 首先檢查是否已有保存的語言設置
  const savedLanguage = localStorage.getItem('language') as 'en' | 'zh' | null;
  if (savedLanguage) {
    return savedLanguage;
  }

  // 獲取瀏覽器語言列表
  const browserLanguages = navigator.languages || [navigator.language];
  
  // 檢查是否包含中文相關語言
  const hasChineseLang = browserLanguages.some(lang => {
    const lowerLang = lang.toLowerCase();
    return lowerLang.includes('zh') || 
           lowerLang.includes('chinese') ||
           lowerLang.includes('cn') ||
           lowerLang.includes('tw') ||
           lowerLang.includes('hk');
  });

  // 如果檢測到中文，返回中文，否則返回英文
  const detectedLanguage: 'en' | 'zh' = hasChineseLang ? 'zh' : 'en';
  
  // 保存檢測結果到 localStorage
  localStorage.setItem('language', detectedLanguage);
  
  return detectedLanguage;
}

// 初始化語言設置的函數
export function initializeLanguage(): 'en' | 'zh' {
  const language = detectBrowserLanguage();
  
  // 觸發語言變更事件，通知其他組件
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('languageChange', { detail: language }));
  }
  
  return language;
}

// 自定義 Hook：用於其他組件使用語言檢測
export function useLanguageDetection() {
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // 初始化語言設置
    const detectedLanguage = detectBrowserLanguage();
    setLanguage(detectedLanguage);

    // 監聽語言變更事件
    const handleLanguageChange = (event: CustomEvent<'en' | 'zh'>) => {
      setLanguage(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  const changeLanguage = (newLanguage: 'en' | 'zh') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: newLanguage }));
  };

  return {
    language,
    changeLanguage,
    mounted
  };
}