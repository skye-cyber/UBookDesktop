import { appState } from '../../State/appState';
import { StateManager } from "../../../common/syscore/StatesManager";

const ThemeClassMap = {
    'light': ['bg-white', 'text-gray-800'],
    'dark': ['bg-gray-950', 'text-gray-200'],
    'sepia': ['book-content'],
    'night': ['bg-gray-900', 'text-gray-300'],
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

        readable?.classList.remove(ThemeClassMap[appState.appearance.theme])
        readable?.classList.add(...ThemeClassMap[`${theme}`])

        appState.appearance.theme = theme;
    }
    static resetTheme() {
        const readable = StateManager.get('readerSection')
        readable.className = "react-portal-root select-text bg-white  dark:bg-gray-950 dark:border-gray-700 shadow-xl shadow-gray-300 rounded-lg selection:bg-[#ff007f]/20"
    }
}

