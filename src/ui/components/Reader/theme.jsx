import { appState } from "./appState";
import { StateManager } from "../../../renderer/js/syscore/StatesManager";

const ThemeClassMap = {
    'light': ['bg-white', 'text-gray-800', 'border-gray-100'],
    'dark': ['bg-gray-950', 'text-gray-200', 'border-gray-100'],
    'sepia': ['book-content', 'border-amber-200'],
    'night': ['bg-gray-900', 'text-gray-300', 'border-gray-800'],
    'tokyo-night': ['']
}

export class ThemeManager {
    static changeTheme(theme) {
        const readable = StateManager.get('readerSection')
        // const themeSelector = readable?.getElementById('themeSelector');

        // Remove all theme classes
        readable.className = readable?.className.replace(/\b(bg-\w+|text-\w+)\b/g, '');

        // Add base classes
        readable?.classList.add('book-content', 'p-6', 'rounded-lg', 'border');

        readable?.classList.remove(ThemeClassMap[appState.currentTheme])
        readable?.classList.add(...ThemeClassMap[`${theme}`])

        appState.currentTheme = theme;
    }
    static resetTheme() {
        const readable = StateManager.get('readerSection')
        readable.className = "react-portal-root select-text bg-gradient-to-b from-[#f8f4e9] to-[#f2ebd8]  dark:from-gray-950 dark:to-gray-950 focus:outline-none mb-4 font-reader overflow-y-hidden mt-1 p-6 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-300 rounded-lg selection:bg-[#ff007f]/20"
    }
}

