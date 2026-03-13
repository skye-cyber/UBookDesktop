import { useState, useEffect } from 'react';
import { appState } from '../../State/appState';
import { StateManager } from '../../../common/syscore/StatesManager';

export const useTheme = () => {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Check for saved theme preference or system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        appState.appearance.theme = savedTheme

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }

        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);

        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const setTheme = (theme) => {
        if (theme === 'system') {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = systemPrefersDark ? "dark" : "light"
        }
        if (theme === 'dark') {
            setIsDark(true);
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            appState.appearance.theme = 'dark'
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            appState.appearance.theme = 'light'
        }

        // Update toolbar theme value
        try {
            StateManager.get('UpdateToolbarTheme')(theme)
        } catch (err) { }
    };

    return {
        isDark,
        toggleTheme,
        setTheme,
        mounted,
        theme: isDark ? 'dark' : 'light'
    };
};
