'use client';

import { useEffect, useState } from "react";
import React from "react";
export default function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        // 預設跟隨系統
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDark(document.documentElement.classList.contains('dark') || isDark);
    }, []);

    const toggleTheme = () => {
        setDark((prev) => {
            const next = !prev;
            if (next) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            return next;
        });
    };

    useEffect(() => {
        // 讀取 localStorage
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            setDark(true);
        } else if (theme === 'light') {
            document.documentElement.classList.remove('dark');
            setDark(false);
        }
    }, []);

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-6 right-6 z-50 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full p-3 shadow-lg transition"
            aria-label="切換深色模式"
        >
            {dark ? "?" : "??"}
        </button>
    );
}