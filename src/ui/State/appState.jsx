export const appSettings = {
    appearance: {
        theme: 'system',
        fontSize: 14,
        fontFamily: 'sans',
        focusMode: false,
        reducedMotion: false
    },
    search: {
        defaultMode: 'text',
        defaultParts: [1, 2, 3, 4, 5],
        caseSensitive: false,
        wholeWords: true,
        historySize: 50,
        saveHistory: false
    },
    reader: {
        fontSize: 16,
        fontName: "normal",
        fontFamily: 'default',
        lineHeight: 1.6,
        maxWidth: 800,
        justifyText: true,
        autoScrollSpeed: 0,
        Fonts: [
            { label: "Default", value: "normal" },
            { label: "Handwriting", value: "handwriting" },
            { label: "Mono", value: "mono" },
            { label: "Brand", value: "brand" },
            { label: "Elegant", value: "elegant" }
        ],
        Themes: [
            { label: "Sepia", value: "sepia" },
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "Night", value: "night" }
        ],

    },
    audio: {
        voice: 'default',
        speed: 0.86,
        pitch: 1.0,
        autoPlay: true
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

export let appState = {
    currentSelection: null,
    selectionRange: null,
    selectedText: null,
    selectedHTML: null,
    bookmarks: [],
    notes: [],
    highlights: [],
    currentFontSize: 16,
    currentFontName: 'normal',
    ...appSettings
};

export function updateAppState(settings) {
    // Update appState with saved settings
    appState = {
        ...appState,
        ...settings
    }
}
