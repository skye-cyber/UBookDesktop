interface ConfigApi {
    init(): Promise<object>;
    read(): Promise<object | false>;
    update(newConfig: object): Promise<boolean>;
    updateTTS(ttsConfig: object): Promise<boolean>;
    reset(): Promise<object | false>;
}

interface TtsApi {
    generate(text: string, engine?: string | null): Promise<string | null>;
    getEngines(): Promise<string[]>;
    test(): Promise<boolean>;
    stop(): boolean;
}

interface FsApi {
    mkdir(dir: string): Promise<boolean>;
    readDir(dir: string): Promise<string[] | false>;
    write(filePath: string, data: any): Promise<boolean>;
    read(filePath: string): Promise<any | false>;
    delete(filePath: string): boolean;
    join(...paths: string[]): string;
    basename(filePath: string, ext?: string): string;
    extname(filePath: string): string;
    dirname(filePath: string): string;
    exists(filePath: string): boolean;
    stat(filePath: string): object;
    rename(oldPath: string, newPath: string): boolean;
    trash(filePath: string): boolean;
    homedir(): string;
    downloads(): string;
    temp(): string;
}

interface NotesApi {
    save(note: object, filePath?: string): Promise<boolean>;
    readAll(filePath?: string): Promise<object | false>;
    delete(noteId: string, filePath?: string): Promise<boolean>;
    update(noteId: string, updatedNote: object, filePath?: string): Promise<boolean>;
}

interface BookmarksApi {
    toggle(data: object, filePath?: string): Promise<{ success: boolean; task: string }>;
    readAll(filePath?: string): Promise<object | false>;
    delete(bookmarkId: string, filePath?: string): Promise<boolean>;
}

interface FavouritesApi {
    toggle(data: object, filePath?: string): Promise<{ success: boolean; task: string }>;
    readAll(filePath?: string): Promise<object | false>;
}

interface ContentApi {
    read(filename: string): Promise<object | false>;
    list(subdir?: string): Promise<string[]>;
}

interface SystemApi {
    platform: string;
    homedir: string;
    cpus: object[];
    totalmem: number;
    freemem: number;
    uptime: number;
    formatDate(isoString: string): Promise<string>;
    isDev(): Promise<boolean>;
    appVersion(): Promise<string>;
}

interface PlayerApi {
    play(filePath?: string | null): Promise<boolean>;
    pause(): string;
    resume(time?: number | null): string;
    stop(): string;
    seek(seconds: number): string;
    fastForward(seconds?: number): string;
    rewind(seconds?: number): string;
    getDuration(): number;
    getCurrentTime(): number;
    isPlaying(): boolean;
}

interface SettingsApi {
    get(): Promise<any>;
    save(settings: any): Promise<any>;
    reset(): Promise<any>;
}

interface ThemeApi {
    init(): void;
    getCurrent(): 'dark' | 'light';
    toggle(): void;
}

// Main window augmentation
declare global {
    interface Window {
        ubook: {
            config: ConfigApi;
            tts: TtsApi;
            fs: FsApi;
            notes: NotesApi;
            bookmarks: BookmarksApi;
            favourites: FavouritesApi;
            content: ContentApi;
            system: SystemApi;
            player: PlayerApi;
            settings: SettingsApi;
            theme: ThemeApi;
        };
        global: Window;
    }
}

export {}; // This makes it a module
