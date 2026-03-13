import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { exec, ExecException } from 'child_process';
import type { Note, BookmarkData, FavouriteData, TTSConfig, AppConfig, ToggleResult } from './types';

// Base directories with types
const BaseDir: string = path.join(os.homedir(), '.UBookDesk');
const notesDir: string = path.join(BaseDir, '.notes');
const favouriteDir: string = path.join(BaseDir, '.favourites');
const bookmarkDir: string = path.join(BaseDir, '.bookmark');
const cacheDir: string = path.join(BaseDir, '.cache');
const configDir: string = path.join(BaseDir, 'config');

// Ensure base directories exist
[BaseDir, notesDir, favouriteDir, bookmarkDir, cacheDir, configDir].forEach((dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// ==================== CONFIG API ====================
const configApi = {
    init: async (): Promise<AppConfig> => {
        const configPath = path.join(configDir, 'config.json');
        const picowavePath = await ipcRenderer.invoke('get-picowave-path');

        if (!fs.existsSync(configPath)) {
            const defaultConfig: AppConfig = {
                tts: {
                    defaultEngine: {
                        name: 'picowave',
                        engine: picowavePath,
                        command: `echo "{safeText}" | ${picowavePath} -w "{cacheFile}"`,
                        inputType: 'text',
                        outputFormat: 'wav',
                        maxTextLength: 1000
                    },
                    engine: 'ttskit3',
                    command: 'ttskit3 --text "{text}" -o "{output}" --threads 8 --speed 0.86',
                    fallbackCommand: `echo "{text}" | ${picowavePath} -w "{output}"`,
                    inputType: 'text',
                    outputFormat: 'wav',
                    maxTextLength: 1000
                },
                appearance: {
                    theme: 'system',
                    fontSize: 14
                },
                paths: {
                    notes: notesDir,
                    favourites: favouriteDir,
                    bookmark: bookmarkDir,
                    cache: cacheDir
                }
            };
            await fs.promises.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
            return defaultConfig;
        }
        return configApi.read() as Promise<AppConfig>;
    },

    read: async (): Promise<AppConfig | false> => {
        const configPath = path.join(configDir, 'config.json');
        try {
            if (fs.existsSync(configPath)) {
                const data = await fs.promises.readFile(configPath, 'utf-8');
                return JSON.parse(data) as AppConfig;
            }
            return configApi.init();
        } catch (err) {
            console.error('Error reading config:', err);
            return false;
        }
    },

    update: async (newConfig: AppConfig): Promise<boolean> => {
        const configPath = path.join(configDir, 'config.json');
        try {
            await fs.promises.writeFile(configPath, JSON.stringify(newConfig, null, 2));
            return true;
        } catch (err) {
            console.error('Error updating config:', err);
            return false;
        }
    },

    updateTTS: async (ttsConfig: Partial<TTSConfig>): Promise<boolean> => {
        const config = await configApi.read();
        if (config && typeof config === 'object') {
            config.tts = { ...config.tts, ...ttsConfig };
            return configApi.update(config as AppConfig);
        }
        return false;
    },

    reset: async (): Promise<AppConfig | false> => {
        const configPath = path.join(configDir, 'config.json');
        try {
            if (fs.existsSync(configPath)) {
                await fs.promises.unlink(configPath);
            }
            return configApi.init();
        } catch (err) {
            console.error('Error resetting config:', err);
            return false;
        }
    }
};

// ==================== TTS API ====================
const ttsApi = {
    generate: async (text: string, engine: string | null = null): Promise<string | null> => {
        if (!text || !text.trim()) return null;

        const config = await configApi.read();
        if (!config || typeof config !== 'object') return null;

        const ttsConfig = config.tts;
        const selectedEngine = engine || ttsConfig.engine;

        // Check text length
        if (text.length > ttsConfig.maxTextLength) {
            console.warn(`Text exceeds maximum length (${ttsConfig.maxTextLength} chars). Truncating.`);
            text = text.substring(0, ttsConfig.maxTextLength);
        }

        // Clean text for command line
        let safeText = text
            .replace(/[\[\]]/g, "")
            .replace(/[“”]/g, "'")
            .replace(/—/g, ", that is to say")
            .replace(/\u00A0/g, " ");

        const cacheFile = path.join(cacheDir, `tts_${Math.random().toString(36).substring(2, 10)}.wav`);

        // Execute TTS command
        try {
            let command: string;
            if (selectedEngine === 'ttskit3' && ttsConfig.command) {
                command = ttsConfig.command
                    .replace('{text}', safeText)
                    .replace('{output}', cacheFile);
            } else if (ttsConfig.fallbackCommand) {
                command = ttsConfig.fallbackCommand
                    .replace('{text}', safeText)
                    .replace('{output}', cacheFile);
            } else {
                throw new Error('No valid TTS command configured');
            }

            await new Promise<void>((resolve, reject) => {
                exec(command, (error: ExecException | null, stdout: string, stderr: string) => {
                    if (error||stderr) {
                        console.error('TTS execution error:', error||stderr, "Output", stdout);
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });

            // Verify file was created
            await fs.promises.access(cacheFile, fs.constants.F_OK);
            return cacheFile;

        } catch (err) {
            console.error('TTS generation failed:', err);
            return null;
        }
    },

    getEngines: async (): Promise<string[]> => {
        const config = await configApi.read();
        const picowavePath = await ipcRenderer.invoke('get-picowave-path');
        return (config && typeof config === 'object' && [config.tts?.engine, config.tts?.defaultEngine.name]) || ['ttskit3', picowavePath];
    },

    test: async (): Promise<boolean> => {
        const testText = "This is a test of the text to speech system.";
        const result = await ttsApi.generate(testText);
        return result !== null;
    },

    stop: (): boolean => {
        // Implementation depends on how you want to handle stopping
        return true;
    }
};

// ==================== FILE SYSTEM API ====================
const fsApi = {
    mkdir: async (dir: string): Promise<boolean> => {
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            return true;
        } catch (err) {
            console.error('mkdir error:', err);
            return false;
        }
    },

    readDir: async (dir: string): Promise<string[] | false> => {
        try {
            return fs.readdirSync(dir);
        } catch (err) {
            console.error('readDir error:', err);
            return false;
        }
    },

    write: async (filePath: string, data: any): Promise<boolean> => {
        try {
            fs.writeFileSync(filePath, data);
            return true;
        } catch (err) {
            console.error('write error:', err);
            return false;
        }
    },

    read: async (filePath: string): Promise<any | false> => {
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            }
            return false;
        } catch (err) {
            console.error('read error:', err);
            return false;
        }
    },

    delete: (filePath: string): boolean => {
        try {
            if (fs.existsSync(filePath)) {
                fs.rmSync(filePath);
                return true;
            }
            return false;
        } catch (err) {
            console.error('delete error:', err);
            return false;
        }
    },

    join: (...paths: string[]): string => path.join(...paths),
    basename: (filePath: string, ext?: string): string => path.basename(filePath, ext),
    extname: (filePath: string): string => path.extname(filePath),
    dirname: (filePath: string): string => path.dirname(filePath),
    exists: (filePath: string): boolean => fs.existsSync(filePath),
    stat: (filePath: string): fs.Stats => fs.statSync(filePath),

    rename: (oldPath: string, newPath: string): boolean => {
        try {
            fs.renameSync(oldPath, newPath);
            return true;
        } catch (err) {
            console.error('rename error:', err);
            return false;
        }
    },

    trash: (filePath: string): boolean => {
        try {
            if (!fs.existsSync(filePath)) return false;

            const platform = os.platform();
            let trashPath: string;

            if (platform === 'win32') {
                trashPath = path.join(process.env.APPDATA || '', 'Microsoft', 'Windows', 'Recycle Bin');
            } else if (platform === 'darwin') {
                trashPath = path.join(os.homedir(), '.Trash');
            } else if (platform === 'linux') {
                trashPath = path.join(os.homedir(), '.local', 'share', 'Trash', 'files');
                if (!fs.existsSync(trashPath)) {
                    fs.mkdirSync(trashPath, { recursive: true });
                }
            } else {
                return false;
            }

            const fileName = path.basename(filePath);
            const newFilePath = path.join(trashPath, fileName);

            // Handle filename conflicts
            let finalPath = newFilePath;
            let counter = 1;
            while (fs.existsSync(finalPath)) {
                const ext = path.extname(fileName);
                const name = path.basename(fileName, ext);
                finalPath = path.join(trashPath, `${name} (${counter})${ext}`);
                counter++;
            }

            fs.renameSync(filePath, finalPath);
            return true;
        } catch (err) {
            console.error('trash error:', err);
            return false;
        }
    },

    homedir: (): string => os.homedir(),
    downloads: (): string => path.join(os.homedir(), 'Downloads'),
    temp: (): string => os.tmpdir()
};

// ==================== NOTES API ====================
const notesApi = {
    save: async (note: Note, filePath: string = path.join(notesDir, 'notes.json')): Promise<boolean> => {
        try {
            let data: { notes: Note[] } = { notes: [] };

            if (fs.existsSync(filePath)) {
                data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
            }

            data.notes.push(note);
            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (err) {
            console.error('saveNote error:', err);
            return false;
        }
    },

    readAll: async (filePath: string = path.join(notesDir, 'notes.json')): Promise<{ notes: Note[] } | false> => {
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
            }
            return { notes: [] };
        } catch (err) {
            console.error('readNotes error:', err);
            return false;
        }
    },

    delete: async (noteId: string, filePath: string = path.join(notesDir, 'notes.json')): Promise<boolean> => {
        try {
            if (!noteId || !fs.existsSync(filePath)) return false;

            const data: { notes: Note[] } = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
            data.notes = data.notes.filter(note => note.timestamp !== noteId);
            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (err) {
            console.error('deleteNote error:', err);
            return false;
        }
    },

    update: async (noteId: string, updatedNote: Partial<Note>, filePath: string = path.join(notesDir, 'notes.json')): Promise<boolean> => {
        try {
            if (!noteId || !fs.existsSync(filePath)) return false;

            const data: { notes: Note[] } = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
            const index = data.notes.findIndex(note => note.timestamp === noteId);
            if (index !== -1) {
                data.notes[index] = { ...data.notes[index], ...updatedNote, timestamp: noteId };
                await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
                return true;
            }
            return false;
        } catch (err) {
            console.error('updateNote error:', err);
            return false;
        }
    }
};

// ==================== BOOKMARKS API ====================
const bookmarksApi = {
    toggle: async (data: BookmarkData, filePath: string = path.join(bookmarkDir, 'bookmark.json')): Promise<ToggleResult> => {
        try {
            let existingData: { bookmark: BookmarkData[] } = { bookmark: [] };
            let result: ToggleResult = { success: true, task: 'none' };

            if (fs.existsSync(filePath)) {
                const content = await fs.promises.readFile(filePath, 'utf-8');
                existingData = JSON.parse(content || '{"bookmark": []}');
            }

            const index = existingData.bookmark.findIndex(bookmark =>
                bookmark.part_id === data.part_id &&
                bookmark.paper_id === data.paper_id &&
                bookmark.section_number === data.section_number
            );

            if (index !== -1) {
                existingData.bookmark.splice(index, 1);
                result.task = 'remove';
            } else {
                existingData.bookmark.push({ ...data, addedAt: new Date().toISOString() });
                result.task = 'add';
            }

            await fs.promises.writeFile(filePath, JSON.stringify(existingData, null, 2));
            return result;
        } catch (err) {
            console.error('toggleBookmark error:', err);
            return { success: false, task: 'error' };
        }
    },

    readAll: async (filePath: string = path.join(bookmarkDir, 'bookmark.json')): Promise<{ bookmark: BookmarkData[] } | false> => {
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
            }
            return { bookmark: [] };
        } catch (err) {
            console.error('readBookmarks error:', err);
            return false;
        }
    },

    delete: async (bookmarkId: string, filePath: string = path.join(bookmarkDir, 'bookmark.json')): Promise<boolean> => {
        try {
            if (!fs.existsSync(filePath)) return false;

            const data: { bookmark: BookmarkData[] } = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
            data.bookmark = data.bookmark.filter(b => b.id !== bookmarkId);
            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (err) {
            console.error('deleteBookmark error:', err);
            return false;
        }
    }
};

// ==================== FAVOURITES API ====================
const favouritesApi = {
    toggle: async (data: FavouriteData, filePath: string = path.join(favouriteDir, 'fav.json')): Promise<ToggleResult> => {
        try {
            let existingData: { fav: FavouriteData[] } = { fav: [] };
            let result: ToggleResult = { success: true, task: 'none' };

            if (fs.existsSync(filePath)) {
                const content = await fs.promises.readFile(filePath, 'utf-8');
                existingData = JSON.parse(content || '{"fav": []}');
            }

            const index = existingData.fav.findIndex(fav =>
                fav.part_id === data.part_id &&
                fav.paper_id === data.paper_id &&
                fav.section_number === data.section_number
            );

            if (index !== -1) {
                existingData.fav.splice(index, 1);
                result.task = 'remove';
            } else {
                existingData.fav.push({ ...data, addedAt: new Date().toISOString() });
                result.task = 'add';
            }

            await fs.promises.writeFile(filePath, JSON.stringify(existingData, null, 2));
            return result;
        } catch (err) {
            console.error('toggleFavourite error:', err);
            return { success: false, task: 'error' };
        }
    },

    readAll: async (filePath: string = path.join(favouriteDir, 'fav.json')): Promise<{ fav: FavouriteData[] } | false> => {
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
            }
            return { fav: [] };
        } catch (err) {
            console.error('readFavourites error:', err);
            return false;
        }
    }
};

// ==================== CONTENT API ====================
const contentApi = {
    read: async (filename: string): Promise<object | false> => {
        try {
            const basePath = path.resolve(__dirname, '../assets/files/');
            const filePath = path.join(basePath, filename);

            if (!fs.existsSync(filePath)) return false;

            const raw = await fs.promises.readFile(filePath, 'utf-8');
            return JSON.parse(raw);
        } catch (err) {
            console.error('readContent error:', err);
            return false;
        }
    },

    list: async (subdir: string = ''): Promise<string[]> => {
        try {
            const basePath = path.resolve(__dirname, '../assets/files/', subdir);
            if (!fs.existsSync(basePath)) return [];

            const files = await fs.promises.readdir(basePath);
            return files.filter(file => file.endsWith('.json'));
        } catch (err) {
            console.error('listContent error:', err);
            return [];
        }
    }
};

// ==================== SYSTEM API ====================
const systemApi = {
    platform: os.platform(),
    homedir: os.homedir(),
    cpus: os.cpus(),
    totalmem: os.totalmem(),
    freemem: os.freemem(),
    uptime: os.uptime(),

    formatDate: async (isoString: string): Promise<string> => {
        const date = new Date(isoString);
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    },

    isDev: async (): Promise<boolean> => ipcRenderer.invoke('get-dev-status'),
    appVersion: async (): Promise<string> => ipcRenderer.invoke('get-app-version')
};

// ==================== AUDIO PLAYER API ====================
let audioContext: AudioContext | undefined;
let audioBuffer: AudioBuffer | undefined;
let sourceNode: AudioBufferSourceNode | undefined;
let pauseTime: number = 0;
let startTime: number = 0;
let isManualStop: boolean = false;
let currentOffset: number = 0;

function playFrom(offset: number = 0): void {
    if (!audioBuffer) return;

    if (sourceNode) {
        try { sourceNode.stop(); } catch { }
        sourceNode.disconnect();
    }

    sourceNode = (audioContext as AudioContext).createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect((audioContext as AudioContext).destination);
    startTime = (audioContext as AudioContext).currentTime - offset;
    currentOffset = offset;

    sourceNode.onended = () => {
        if (!isManualStop) {
            setTimeout(() => {
                document.dispatchEvent(new Event('play-finished'));
            }, 0);
        } else {
            isManualStop = false;
        }
    };

    sourceNode.start(0, offset);
}

const playerApi = {
    play: async (filePath: string | null = null): Promise<boolean> => {
        try {
            if (!audioContext) audioContext = new AudioContext();

            const fileData = fs.readFileSync(filePath as string);
            const arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength);

            if (arrayBuffer.byteLength === 0) throw new Error("Empty audio buffer");

            audioBuffer = await (audioContext as AudioContext).decodeAudioData(arrayBuffer);
            playFrom(0);
            return true;
        } catch (err) {
            console.error("Playback error:", err);
            return false;
        }
    },

    pause: (): string => {
        if (sourceNode) {
            isManualStop = true;
            sourceNode.stop();
            pauseTime = (audioContext as AudioContext).currentTime - startTime;
            sourceNode = undefined;
        }
        return "paused";
    },

    resume: (time: number | null = null): string => {
        pauseTime = time !== null ? time : pauseTime;
        if (audioBuffer && pauseTime) {
            playFrom(pauseTime);
            pauseTime = 0;
            return "resumed";
        }
        return "Nothing to resume";
    },

    stop: (): string => {
        isManualStop = true;
        if (sourceNode) {
            sourceNode.stop();
            sourceNode = undefined;
        }
        audioBuffer = undefined;
        pauseTime = 0;
        currentOffset = 0;
        return "stopped";
    },

    seek: (seconds: number): string => {
        if (!audioBuffer) return "No audio loaded";
        const offset = Math.min(Math.max(0, seconds), audioBuffer.duration);
        playFrom(offset);
        return `Seeked to ${offset.toFixed(2)}s`;
    },

    fastForward: (seconds: number = 5): string => {
        if (!audioBuffer) return "No audio loaded";
        let newOffset = currentOffset + seconds;
        if (newOffset >= audioBuffer.duration) newOffset = audioBuffer.duration - 0.1;
        playFrom(newOffset);
        return newOffset.toFixed(2);
    },

    rewind: (seconds: number = 5): string => {
        if (!audioBuffer) return "No audio loaded";
        let newOffset = currentOffset - seconds;
        if (newOffset < 0) newOffset = 0;
        playFrom(newOffset);
        return newOffset.toFixed(2);
    },

    getDuration: (): number => audioBuffer?.duration || 0,
    getCurrentTime: (): number => currentOffset,
    isPlaying: (): boolean => sourceNode !== null && !isManualStop
};

// ==================== SETTINGS API (via IPC) ====================
const settingsApi = {
    get: (): Promise<any> => ipcRenderer.invoke('get-settings'),
    save: (settings: any): Promise<any> => ipcRenderer.invoke('save-settings', settings),
    reset: (): Promise<any> => ipcRenderer.invoke('reset-settings')
};

// ==================== THEME API ====================
const themeApi = {
    init: (): void => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        ipcRenderer.send('theme-changed', isDarkMode);

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e: MediaQueryListEvent) => {
            ipcRenderer.send('theme-changed', e.matches);
        });
    },

    getCurrent: (): 'dark' | 'light' => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    toggle: (): void => {
        ipcRenderer.send('toggle-theme');
    }
};

// ==================== EXPOSE APIS ====================
contextBridge.exposeInMainWorld('ubook', {
    config: configApi,
    tts: ttsApi,
    fs: fsApi,
    notes: notesApi,
    bookmarks: bookmarksApi,
    favourites: favouritesApi,
    content: contentApi,
    system: systemApi,
    player: playerApi,
    settings: settingsApi,
    theme: themeApi
});

// Initialize theme
themeApi.init();
