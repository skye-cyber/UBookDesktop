import { StateManager } from "./StatesManager";

class SettingsManager {
    constructor() {
        this.settings = {
            appearance: {
                theme: 'system', // 'light', 'dark', 'system'
                fontSize: 14,
                fontFamily: 'sans',
                compactMode: false,
                reducedMotion: false
            },
            search: {
                defaultMode: 'text',
                defaultParts: [1, 2, 3, 4, 5],
                caseSensitive: false,
                wholeWords: false,
                historySize: 50,
                saveHistory: true
            },
            reader: {
                fontSize: 18,
                fontFamily: 'reader',
                lineHeight: 1.6,
                maxWidth: 800,
                justifyText: true,
                autoScrollSpeed: 0
            },
            audio: {
                voice: 'default',
                speed: 0.86,
                pitch: 1.0,
                autoPlay: false
            },
            privacy: {
                analytics: false,
                crashReports: true,
                autoSaveNotes: true
            },
            shortcuts: {
                toggleSearch: 'Ctrl+K',
                toggleSettings: 'Ctrl+,',
                toggleReader: 'Ctrl+R',
                toggleDarkMode: 'Ctrl+D'
            }
        };

        this.listeners = new Set();
        this.loadSettings();
    }

    // Load from disk (using your existing fs API)
    async loadSettings() {
        try {
            const saved = await window.ubook.fs.read(
                window.ubook.fs.join(window.ubook.fs.homedir(), '.UBookDesk', 'config', 'user-settings.json')
            );
            if (saved) {
                this.settings = this.mergeSettings(saved, this.settings);
            }
        } catch (e) {
            console.log('No saved settings found, using defaults');
        }
        this.notifyListeners();
    }

    // Save to disk
    async saveSettings() {
        try {
            await window.ubook.fs.write(
                window.ubook.fs.join(window.ubook.fs.homedir(), '.UBookDesk', 'config', 'user-settings.json'),
                JSON.stringify(this.settings, null, 2)
            );
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    // Get all settings
    getAll() {
        return { ...this.settings };
    }

    // Get a specific setting
    get(category, key) {
        return this.settings[category]?.[key];
    }

    // Update a setting
    async set(category, key, value) {
        if (!this.settings[category]) {
            this.settings[category] = {};
        }
        this.settings[category][key] = value;
        await this.saveSettings();
        this.notifyListeners();

        // Apply real-time changes
        this.applySetting(category, key, value);
    }

    // Update multiple settings at once
    async update(category, updates) {
        this.settings[category] = {
            ...this.settings[category],
            ...updates
        };
        await this.saveSettings();
        this.notifyListeners();

        // Apply all changes
        Object.entries(updates).forEach(([key, value]) => {
            this.applySetting(category, key, value);
        });
    }

    // Apply setting changes to the app
    applySetting(category, key, value) {
        switch (category) {
            case 'appearance':
                if (key === 'theme') this.applyTheme(value);
                if (key === 'fontSize') document.documentElement.style.fontSize = `${value}px`;
                if (key === 'compactMode') document.documentElement.classList.toggle('compact-mode', value);
                break;
            case 'reader':
                if (key === 'fontFamily') {
                    document.querySelector('.reader-content')?.style.setProperty('--font-family', value);
                }
                break;
        }
    }

    applyTheme(theme) {
        const root = document.documentElement;
        if (theme === 'system') {
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            root.classList.toggle('dark', systemDark);
        } else {
            root.classList.toggle('dark', theme === 'dark');
        }
    }

    // Subscribe to changes
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener(this.settings));
    }

    // Merge saved settings with defaults
    mergeSettings(saved, defaults) {
        const merged = { ...defaults };
        for (const category in saved) {
            if (merged[category]) {
                merged[category] = { ...merged[category], ...saved[category] };
            } else {
                merged[category] = saved[category];
            }
        }
        return merged;
    }

    // Reset to defaults
    async resetToDefaults() {
        this.settings = {
            appearance: { theme: 'system', fontSize: 14, fontFamily: 'sans', compactMode: false, reducedMotion: false },
            search: { defaultMode: 'text', defaultParts: [1, 2, 3, 4, 5], caseSensitive: false, wholeWords: false, historySize: 50, saveHistory: true },
            reader: { fontSize: 18, fontFamily: 'reader', lineHeight: 1.6, maxWidth: 800, justifyText: true, autoScrollSpeed: 0 },
            audio: { voice: 'default', speed: 0.86, pitch: 1.0, autoPlay: false },
            privacy: { analytics: false, crashReports: true, autoSaveNotes: true },
            shortcuts: { toggleSearch: 'Ctrl+K', toggleSettings: 'Ctrl+,', toggleReader: 'Ctrl+R', toggleDarkMode: 'Ctrl+D' }
        };
        await this.saveSettings();
        this.notifyListeners();

        // Reapply all settings
        Object.entries(this.settings).forEach(([category, values]) => {
            Object.entries(values).forEach(([key, value]) => {
                this.applySetting(category, key, value);
            });
        });
    }
}
const settings = ()=>(
    <button
    /*onClick={openSettings}*/
    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    title="Settings"
    >
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
    </svg>
    </button>
)
export const settingsManager = new SettingsManager();
