import { appState } from "./appState";

export class ThemeManager {
    static changeTheme(theme) {
        const ThemeClassMap = {
            'light': ['bg-white', 'text-gray-800', 'border-gray-300'],
            'dark': ['bg-gradient-to-b', 'from-[#f8f4e9]', 'to-[#f2ebd8]', 'dark:from-gray-950', 'dark:to-gray-950', 'text-gray-200', 'border-gray-100'],
            'sepia': ['book-content', 'border-amber-200'],
            'night': ['bg-gray-900', 'text-gray-300', 'border-gray-800'],
        }

        const readable = window.StateManager.get('readerSection')
        // const themeSelector = readable?.getElementById('themeSelector');

        // Remove all theme classes
        readable.className = readable?.className.replace(/\b(bg-\w+|text-\w+)\b/g, '');

        // Add base classes
        readable?.classList.add('book-content', 'p-6', 'rounded-lg', 'border');

        readable?.classList.remove(ThemeClassMap[appState.currentTheme])
        readable?.classList.add(...ThemeClassMap[`${theme}`])

        // Add theme-specific classes
        switch (theme) {
            case 'light':
                readable?.classList.add('bg-white', 'text-gray-800', 'border-gray-300');
                break;
            case 'sepia':
                readable?.classList.add('book-content', 'border-amber-200');
                break;
            case 'dark':
                readable?.classList.add('bg-gray-800', 'text-gray-200', 'border-gray-700');
                break;
            case 'night':
                readable?.classList.add('bg-gray-900', 'text-gray-300', 'border-gray-800');
                break;
        }
        appState.currentTheme = theme;
    }
}

