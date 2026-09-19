import { invoke } from '@tauri-apps/api/core';
// import { path } from '@tauri-apps/api';
import type {
    Note,
    BookmarkData,
    FavouriteData,
    TTSConfig,
    AppConfig,
    ToggleResult,
} from './types';
import { TTSValidator } from './utils/ttsValidation';
import { playerApi } from './player';

// ==================== CONFIG ====================
export const configApi = {
    init: () => invoke<AppConfig>('config_init'),
    read: () =>
        invoke<AppConfig>('config_read').catch(async () => {
            // Fall back to init if missing
            return invoke<AppConfig>('config_init');
        }),
    update: (newConfig: AppConfig) => invoke<boolean>('config_update', { newConfig }),
    updateTTS: (patch: Partial<TTSConfig>) =>
        invoke<boolean>('config_update_tts', { patch }),
    reset: () => invoke<AppConfig>('config_reset'),
};

// ==================== TTS ====================
export const ttsApi = {
    generate: (text: string, engine: string | null = null) =>
        invoke<string | null>('tts_generate', { text, engine }),

    getEngines: async (): Promise<string[]> => {
        const cfg = await configApi.read();
        const pico = await invoke<string>('get_picowave_path');
        return [cfg?.tts?.engine ?? 'ttskit3', cfg?.tts?.defaultEngine?.name ?? pico];
    },

    test: async (): Promise<boolean> => {
        const out = await ttsApi.generate('This is a test of the text to speech system.');
        return out !== null;
    },

    stop: (): boolean => true,
};

// ==================== FS ====================
export const fsApi = {
    mkdir: (dir: string) => invoke<boolean>('fs_mkdir', { dir }),
    readDir: (dir: string) =>
        invoke<string[]>('fs_read_dir', { dir }).catch(() => false as const),
    write: (filePath: string, data: string) =>
        invoke<boolean>('fs_write', { filePath, data: typeof data === 'string' ? data : JSON.stringify(data) }),
    read: (filePath: string) =>
        invoke<any>('fs_read', { filePath }).catch(() => false as const),
    delete: (filePath: string) => invoke<boolean>('fs_delete', { filePath }),
    exists: (filePath: string) => invoke<boolean>('fs_exists', { filePath }),
    rename: (oldPath: string, newPath: string) =>
        invoke<boolean>('fs_rename', { oldPath, newPath }),
    trash: (filePath: string) => invoke<boolean>('fs_trash', { filePath }),
    homedir: () => invoke<string>('fs_homedir'),
    downloads: () => invoke<string>('fs_downloads'),
    temp: () => invoke<string>('fs_temp'),

    // Pure helpers — no IPC needed
    join: (...parts: string[]) => parts.filter(Boolean).join('/').replace(/\/+/g, '/'),
    basename: (p: string, ext?: string) => {
        const base = p.split(/[\\/]/).pop() ?? '';
        return ext && base.endsWith(ext) ? base.slice(0, -ext.length) : base;
    },
    extname: (p: string) => {
        const base = p.split(/[\\/]/).pop() ?? '';
        const dot = base.lastIndexOf('.');
        return dot > 0 ? base.slice(dot) : '';
    },
    dirname: (p: string) => {
        const parts = p.split(/[\\/]/);
        parts.pop();
        return parts.join('/') || '/';
    },
    stat: async (p: string) => ({ size: await invoke<number>('fs_stat_size', { filePath: p }) }),
};

// ==================== NOTES ====================
export const notesApi = {
    save: (note: Note, filePath?: string) =>
        invoke<boolean>('notes_save', { note, filePath }),
    readAll: (filePath?: string) =>
        invoke<{ notes: Note[] }>('notes_read_all', { filePath }).catch(() => false as const),
    delete: (noteId: string, filePath?: string) =>
        invoke<boolean>('notes_delete', { noteId, filePath }),
    update: (noteId: string, updatedNote: Partial<Note>, filePath?: string) =>
        invoke<boolean>('notes_update', { noteId, updatedNote, filePath }),
};

// ==================== BOOKMARKS ====================
export const bookmarksApi = {
    toggle: (data: BookmarkData, filePath?: string) =>
        invoke<ToggleResult>('bookmarks_toggle', { data, filePath }),
    readAll: (filePath?: string) =>
        invoke<{ bookmark: BookmarkData[] }>('bookmarks_read_all', { filePath }).catch(
            () => false as const,
        ),
    delete: (bookmarkId: string, filePath?: string) =>
        invoke<boolean>('bookmarks_delete', { bookmarkId, filePath }),
};

// ==================== FAVOURITES ====================
export const favouritesApi = {
    toggle: (data: FavouriteData, filePath?: string) =>
        invoke<ToggleResult>('favourites_toggle', { data, filePath }),
    readAll: (filePath?: string) =>
        invoke<{ fav: FavouriteData[] }>('favourites_read_all', { filePath }).catch(
            () => false as const,
        ),
};

// ==================== CONTENT ====================
export const contentApi = {
    read: (filename: string) =>
        invoke<object>('content_read', { filename }).catch(() => false as const),
    list: (subdir: string = '') =>
        invoke<string[]>('content_list', { subdir }).catch(() => []),
};

// ==================== SYSTEM ====================
export const systemApi = {
    platform: navigator.platform.toLowerCase().includes('win')
        ? 'win32'
        : navigator.platform.toLowerCase().includes('mac')
            ? 'darwin'
            : 'linux',

    homedir: fsApi.homedir,   // async — matches old API surface
    downloads: fsApi.downloads,
    temp: fsApi.temp,

    formatDate: async (isoString: string): Promise<string> =>
        new Date(isoString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }),

    isDev: () => invoke<boolean>('get_dev_status'),
    appVersion: () => invoke<string>('get_app_version'),
};

// ==================== AUDIO PLAYER (Web Audio API) ====================
// Same as Electron — Web Audio already works identically in the Tauri webview.
export { playerApi } from './player';

// ==================== SETTINGS ====================
// The original delegated to nonexistent IPC handlers in main.ts. Now we reuse
// configApi directly (config.json is the settings store).
export const settingsApi = {
    get: () => configApi.read(),
    save: (settings: AppConfig) => configApi.update(settings),
    reset: () => configApi.reset(),
};

// ==================== THEME ====================
export const themeApi = {
    init: () => {
        // Notify Rust so it updates tray/window icon
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        invoke('theme_notify', { isDark }).catch(() => { });
        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                invoke('theme_notify', { isDark: e.matches }).catch(() => { });
            });
    },
    getCurrent: (): 'dark' | 'light' =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    toggle: () => {
        // Optional: Tauri doesn't expose programmatic OS theme toggle.
        // If you need an in-app theme override, store it in config.json instead.
        document.documentElement.classList.toggle('dark');
    },
};


// Re-export everything under one namespace so React code can do:
//   import { ubook } from '@common/ubook';
//   ubook.config.read()  ...
export const ubook = {
    config: configApi,
    tts: ttsApi,
    TTSValidator,
    fs: fsApi,
    notes: notesApi,
    bookmarks: bookmarksApi,
    favourites: favouritesApi,
    content: contentApi,
    system: systemApi,
    player: playerApi,
    settings: settingsApi,
    theme: themeApi,
};

themeApi.init();
