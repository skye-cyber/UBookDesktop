export interface Note {
    timestamp: string;
    title?: string;
    content: string;
    [key: string]: any;
}
export interface BookmarkData {
    part_id: string;
    paper_id: string;
    section_number: string;
    id?: string;
    addedAt?: string;
    [key: string]: any;
}
export interface FavouriteData {
    part_id: string;
    paper_id: string;
    section_number: string;
    addedAt?: string;
    [key: string]: any;
}
export interface DefaultTTSEngine {
    name: string;
    engine: string;
    command: string;
    inputType: 'text' | 'file';
    outputFormat: string;
    maxTextLength: number;
}
export interface TTSConfig {
    defaultEngine: DefaultTTSEngine;
    engine: string;
    command: string;
    fallbackCommand: string;
    inputType: 'text' | 'file';
    outputFormat: string;
    maxTextLength: number;
}
export interface AppConfig {
    tts: TTSConfig;
    appearance: {
        theme: 'system' | 'dark' | 'light';
        fontSize: number;
    };
    paths: {
        notes: string;
        favourites: string;
        bookmark: string;
        cache: string;
    };
}
export interface ToggleResult {
    success: boolean;
    task: 'add' | 'remove' | 'none' | 'error';
}
//# sourceMappingURL=types.d.ts.map