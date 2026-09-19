import type { Note, BookmarkData, FavouriteData, TTSConfig, AppConfig, ToggleResult } from './types';
export declare const configApi: {
    init: () => Promise<AppConfig>;
    read: () => Promise<AppConfig>;
    update: (newConfig: AppConfig) => Promise<boolean>;
    updateTTS: (patch: Partial<TTSConfig>) => Promise<boolean>;
    reset: () => Promise<AppConfig>;
};
export declare const ttsApi: {
    generate: (text: string, engine?: string | null) => Promise<string | null>;
    getEngines: () => Promise<string[]>;
    test: () => Promise<boolean>;
    stop: () => boolean;
};
export declare const fsApi: {
    mkdir: (dir: string) => Promise<boolean>;
    readDir: (dir: string) => Promise<false | string[]>;
    write: (filePath: string, data: string) => Promise<boolean>;
    read: (filePath: string) => Promise<any>;
    delete: (filePath: string) => Promise<boolean>;
    exists: (filePath: string) => Promise<boolean>;
    rename: (oldPath: string, newPath: string) => Promise<boolean>;
    trash: (filePath: string) => Promise<boolean>;
    homedir: () => Promise<string>;
    downloads: () => Promise<string>;
    temp: () => Promise<string>;
    join: (...parts: string[]) => string;
    basename: (p: string, ext?: string) => string;
    extname: (p: string) => string;
    dirname: (p: string) => string;
    stat: (p: string) => Promise<{
        size: number;
    }>;
};
export declare const notesApi: {
    save: (note: Note, filePath?: string) => Promise<boolean>;
    readAll: (filePath?: string) => Promise<false | {
        notes: Note[];
    }>;
    delete: (noteId: string, filePath?: string) => Promise<boolean>;
    update: (noteId: string, updatedNote: Partial<Note>, filePath?: string) => Promise<boolean>;
};
export declare const bookmarksApi: {
    toggle: (data: BookmarkData, filePath?: string) => Promise<ToggleResult>;
    readAll: (filePath?: string) => Promise<false | {
        bookmark: BookmarkData[];
    }>;
    delete: (bookmarkId: string, filePath?: string) => Promise<boolean>;
};
export declare const favouritesApi: {
    toggle: (data: FavouriteData, filePath?: string) => Promise<ToggleResult>;
    readAll: (filePath?: string) => Promise<false | {
        fav: FavouriteData[];
    }>;
};
export declare const contentApi: {
    read: (filename: string) => Promise<false | object>;
    list: (subdir?: string) => Promise<string[] | never[]>;
};
export declare const systemApi: {
    platform: string;
    homedir: () => Promise<string>;
    downloads: () => Promise<string>;
    temp: () => Promise<string>;
    formatDate: (isoString: string) => Promise<string>;
    isDev: () => Promise<boolean>;
    appVersion: () => Promise<string>;
};
export { playerApi } from './player';
export declare const settingsApi: {
    get: () => Promise<AppConfig>;
    save: (settings: AppConfig) => Promise<boolean>;
    reset: () => Promise<AppConfig>;
};
export declare const themeApi: {
    init: () => void;
    getCurrent: () => "dark" | "light";
    toggle: () => void;
};
export declare const ubook: {
    config: {
        init: () => Promise<AppConfig>;
        read: () => Promise<AppConfig>;
        update: (newConfig: AppConfig) => Promise<boolean>;
        updateTTS: (patch: Partial<TTSConfig>) => Promise<boolean>;
        reset: () => Promise<AppConfig>;
    };
    tts: {
        generate: (text: string, engine?: string | null) => Promise<string | null>;
        getEngines: () => Promise<string[]>;
        test: () => Promise<boolean>;
        stop: () => boolean;
    };
    TTSValidator: {
        DANGEROUS_PATTERNS: RegExp[];
        ALLOWED_FLAGS: RegExp;
        MAX_COMMAND_LENGTH: number;
        validateTTS: (ttsConfig: Partial<TTSConfig>, options?: import("./utils/type").TTSValidationOptions) => Promise<import("./utils/type").ValidationResult>;
        validateCommandSafety: (command: string) => import("./utils/type").ValidationResult;
        validateEngineName: (engine: string) => import("./utils/type").ValidationResult;
        checkExecutableExists: (executable: string) => Promise<{
            exists: boolean;
            warning?: string;
        }>;
        testCommandWithHelp: (command: string, timeout: number | undefined) => Promise<{
            success: boolean;
            error?: string;
        }>;
    };
    fs: {
        mkdir: (dir: string) => Promise<boolean>;
        readDir: (dir: string) => Promise<false | string[]>;
        write: (filePath: string, data: string) => Promise<boolean>;
        read: (filePath: string) => Promise<any>;
        delete: (filePath: string) => Promise<boolean>;
        exists: (filePath: string) => Promise<boolean>;
        rename: (oldPath: string, newPath: string) => Promise<boolean>;
        trash: (filePath: string) => Promise<boolean>;
        homedir: () => Promise<string>;
        downloads: () => Promise<string>;
        temp: () => Promise<string>;
        join: (...parts: string[]) => string;
        basename: (p: string, ext?: string) => string;
        extname: (p: string) => string;
        dirname: (p: string) => string;
        stat: (p: string) => Promise<{
            size: number;
        }>;
    };
    notes: {
        save: (note: Note, filePath?: string) => Promise<boolean>;
        readAll: (filePath?: string) => Promise<false | {
            notes: Note[];
        }>;
        delete: (noteId: string, filePath?: string) => Promise<boolean>;
        update: (noteId: string, updatedNote: Partial<Note>, filePath?: string) => Promise<boolean>;
    };
    bookmarks: {
        toggle: (data: BookmarkData, filePath?: string) => Promise<ToggleResult>;
        readAll: (filePath?: string) => Promise<false | {
            bookmark: BookmarkData[];
        }>;
        delete: (bookmarkId: string, filePath?: string) => Promise<boolean>;
    };
    favourites: {
        toggle: (data: FavouriteData, filePath?: string) => Promise<ToggleResult>;
        readAll: (filePath?: string) => Promise<false | {
            fav: FavouriteData[];
        }>;
    };
    content: {
        read: (filename: string) => Promise<false | object>;
        list: (subdir?: string) => Promise<string[] | never[]>;
    };
    system: {
        platform: string;
        homedir: () => Promise<string>;
        downloads: () => Promise<string>;
        temp: () => Promise<string>;
        formatDate: (isoString: string) => Promise<string>;
        isDev: () => Promise<boolean>;
        appVersion: () => Promise<string>;
    };
    player: {
        play: (filePath?: string | null) => Promise<boolean>;
        pause: () => string;
        resume: (time?: number | null) => string;
        stop: () => string;
        seek: (seconds: number) => string;
        fastForward: (seconds?: number) => string;
        rewind: (seconds?: number) => string;
        getDuration: () => number;
        getCurrentTime: () => number;
        isPlaying: () => boolean;
    };
    settings: {
        get: () => Promise<AppConfig>;
        save: (settings: AppConfig) => Promise<boolean>;
        reset: () => Promise<AppConfig>;
    };
    theme: {
        init: () => void;
        getCurrent: () => "dark" | "light";
        toggle: () => void;
    };
};
//# sourceMappingURL=ubook.d.ts.map