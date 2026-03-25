/// <reference path="../../types/preload.d.ts" />
import { FontSizeManager_ins } from "../../ui/components/Reader/font_manager";
import { StateManager } from "./StatesManager";
import { appSettings, updateAppSettings, updateAppState } from "../../ui/State/appState";
import { ChangeFontName as ChangeReaderFontName } from "../../ui/components/Reader/font_manager";
import { textmanager } from "../../ui/components/Reader/TextManager";

class SettingsManager {
    constructor() {
        this.listeners = new Set();
        this.loadSettings();
        this.subscribe(updateAppState)
    }

    // Load from disk (using your existing fs API)
    async loadSettings() {
        try {
            const saved = await window.ubook.fs.read(
                window.ubook.fs.join(window.ubook.fs.homedir(), '.UBookDesk', 'config', 'user-settings.json')
            );
            if (saved) {
                updateAppSettings(this.mergeSettings(saved, appSettings));
                updateAppState(saved)
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
                JSON.stringify(appSettings, null, 2)
            );
            updateAppState(appSettings)
        } catch (e) {
            console.error('Failed to save settings:', e);
        }
    }

    // Get all settings
    getAll() {
        return { ...appSettings };
    }

    // Get a specific setting
    get(category, key) {
        return appSettings[category]?.[key];
    }

    // Update a setting
    async set(category, key, value) {
        if (!appSettings[category]) {
            appSettings[category] = {};
        }
        appSettings[category][key] = value;
        await this.saveSettings();
        this.notifyListeners();

        // Apply real-time changes
        this.applySetting(category, key, value);
    }

    // Update multiple settings at once
    async update(category, updates) {
        appSettings[category] = {
            ...appSettings[category],
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
                if (key === 'theme') StateManager.set('theme', value)
                if (key === 'fontSize') FontSizeManager_ins.changeFontSize(0, value);
                if (key === 'focusMode') {
                    const isfocused = StateManager.get('focusMode')

                    // Toggling focus on while it's on does nothing and vice versa'
                    if (value === isfocused) return

                    document.dispatchEvent(new CustomEvent('focusMode'))
                    StateManager.get('readerTopPanelToggle')()
                    StateManager.set('focusMode', !isfocused)
                }
                break;
            case 'reader':
                if (key === 'fontSize') FontSizeManager_ins.changeFontSize(0, value);
                if (key === 'fontName') ChangeReaderFontName(value);
                if (key === 'lineHeight') textmanager.changeLineHeight(value);

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
        this.listeners.forEach(listener => listener(appSettings));
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
         const settings ={
            appearance: { theme: 'system', fontSize: 14, fontFamily: 'sans', focusMode: false, reducedMotion: false },
            search: { defaultMode: 'text', defaultParts: [1, 2, 3, 4, 5], caseSensitive: false, wholeWords: false, historySize: 50, saveHistory: true },
            reader: { fontSize: 18, fontFamily: 'reader', lineHeight: 1.6, maxWidth: 800, justifyText: true, autoScrollSpeed: 0 },
            audio: { voice: 'default', speed: 0.86, pitch: 1.0, autoPlay: false },
            privacy: { analytics: false, crashReports: true, autoSaveNotes: true },
            shortcuts: { toggleSearch: 'Ctrl+K', toggleSettings: 'Ctrl+,', toggleReader: 'Ctrl+R', toggleDarkMode: 'Ctrl+D' }
        };
        updateAppSettings(settings)
        await this.saveSettings();
        this.notifyListeners();

        // Reapply all settings
        Object.entries(appSettings).forEach(([category, values]) => {
            Object.entries(values).forEach(([key, value]) => {
                this.applySetting(category, key, value);
            });
        });
    }
}

export const settingsManager = new SettingsManager();
