const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

window.global = window;
contextBridge.exposeInMainWorld('global', window);

// Base directories
const BaseDir = path.join(os.homedir(), '.UBookDesk');
const notesDir = path.join(BaseDir, '.notes');
const favouriteDir = path.join(BaseDir, '.favourites');
const bookmarkDir = path.join(BaseDir, '.bookmark');
const cacheDir = path.join(BaseDir, '.cache');
const configDir = path.join(BaseDir, 'config');

// Ensure base directories exist
[BaseDir, notesDir, favouriteDir, bookmarkDir, cacheDir, configDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// ==================== CONFIG API ====================
const configApi = {
    // Initialize default config
    init: async () => {
        const configPath = path.join(configDir, 'config.json');
        if (!fs.existsSync(configPath)) {
            const defaultConfig = {
                tts: {
                    engine: 'ttskit3',
                    command: 'ttskit3 --text "{text}" -o "{output}" --threads 8 --speed 0.86',
                    fallbackCommand: 'echo "{text}" | picowave -w "{output}"',
                    inputType: 'text', // 'text' or 'file'
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
        return configApi.read();
    },

    read: async () => {
        const configPath = path.join(configDir, 'config.json');
        try {
            if (fs.existsSync(configPath)) {
                const data = await fs.promises.readFile(configPath, 'utf-8');
                return JSON.parse(data);
            }
            return configApi.init();
        } catch (err) {
            console.error('Error reading config:', err);
            return false;
        }
    },

    update: async (newConfig) => {
        const configPath = path.join(configDir, 'config.json');
        try {
            await fs.promises.writeFile(configPath, JSON.stringify(newConfig, null, 2));
            return true;
        } catch (err) {
            console.error('Error updating config:', err);
            return false;
        }
    },

    updateTTS: async (ttsConfig) => {
        const config = await configApi.read();
        if (config) {
            config.tts = { ...config.tts, ...ttsConfig };
            return configApi.update(config);
        }
        return false;
    },

    reset: async () => {
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
    // Generate audio from text using configured TTS engine
    generate: async (text, engine = null) => {
        if (!text || !text.trim()) return null;

        const config = await configApi.read();
        if (!config) return null;

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
        .replace(/“/g, "'")
        .replace(/”/g, "'")
        .replace(/—/g, ", that is to say")
        .replace(/ /g, " ");

        const cacheFile = path.join(cacheDir, `tts_${Math.random().toString(36).substring(2, 10)}.wav`);

        // Execute TTS command
        try {
            let command;
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

            await new Promise((resolve, reject) => {
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error('TTS execution error:', error);
                        reject(error);
                    } else {
                        resolve(stdout);
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

    // Get available TTS engines from config
    getEngines: async () => {
        const config = await configApi.read();
        return config?.tts?.engines || ['ttskit3', 'picowave'];
    },

    // Test TTS configuration
    test: async () => {
        const testText = "This is a test of the text to speech system.";
        const result = await ttsApi.generate(testText);
        return result !== null;
    },

    // Stop current TTS generation (if long-running)
    stop: () => {
        // Implementation depends on how you want to handle stopping
        // Could kill child process if you track it
        return true;
    }
};

// ==================== FILE SYSTEM API ====================
const fsApi = {
    // Directory operations
    mkdir: async (dir) => {
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

    readDir: async (dir) => {
        try {
            return fs.readdirSync(dir);
        } catch (err) {
            console.error('readDir error:', err);
            return false;
        }
    },

    // File operations
    write: async (filePath, data) => {
        try {
            fs.writeFileSync(filePath, data);
            return true;
        } catch (err) {
            console.error('write error:', err);
            return false;
        }
    },

    read: async (filePath) => {
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

    delete: (filePath) => {
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

    // Path utilities
    join: (...paths) => path.join(...paths),
    basename: (filePath, ext) => path.basename(filePath, ext),
    extname: (filePath) => path.extname(filePath),
    dirname: (filePath) => path.dirname(filePath),
    exists: (filePath) => fs.existsSync(filePath),
    stat: (filePath) => fs.statSync(filePath),

    // Rename/Move
    rename: (oldPath, newPath) => {
        try {
            fs.renameSync(oldPath, newPath);
            return true;
        } catch (err) {
            console.error('rename error:', err);
            return false;
        }
    },

    // Trash (move to system trash)
    trash: (filePath) => {
        try {
            if (!fs.existsSync(filePath)) return false;

            const platform = os.platform();
            let trashPath;

            if (platform === 'win32') {
                trashPath = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Recycle Bin');
            } else if (platform === 'darwin') {
                trashPath = path.join(os.homedir(), '.Trash');
            } else if (platform === 'linux') {
                trashPath = path.join(os.homedir(), '.local', 'share', 'Trash', 'files');
                // Ensure trash directory exists on Linux
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

    // Get user paths
    homedir: () => os.homedir(),
    downloads: () => path.join(os.homedir(), 'Downloads'),
    temp: () => os.tmpdir()
};

// ==================== NOTES API ====================
const notesApi = {
    save: async (note, filePath = path.join(notesDir, 'notes.json')) => {
        try {
            let data = { notes: [] };

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

    readAll: async (filePath = path.join(notesDir, 'notes.json')) => {
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

    delete: async (noteId, filePath = path.join(notesDir, 'notes.json')) => {
        try {
            if (!noteId || !fs.existsSync(filePath)) return false;

            const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
            data.notes = data.notes.filter(note => note.timestamp !== noteId);
            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (err) {
            console.error('deleteNote error:', err);
            return false;
        }
    },

    update: async (noteId, updatedNote, filePath = path.join(notesDir, 'notes.json')) => {
        try {
            if (!noteId || !fs.existsSync(filePath)) return false;

            const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
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
    toggle: async (data, filePath = path.join(bookmarkDir, 'bookmark.json')) => {
        try {
            let existingData = { bookmark: [] };
            let result = { success: true, task: 'none' };

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

    readAll: async (filePath = path.join(bookmarkDir, 'bookmark.json')) => {
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

    delete: async (bookmarkId, filePath = path.join(bookmarkDir, 'bookmark.json')) => {
        try {
            if (!fs.existsSync(filePath)) return false;

            const data = JSON.parse(await fs.promises.readFile(filePath, 'utf-8'));
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
    toggle: async (data, filePath = path.join(favouriteDir, 'fav.json')) => {
        try {
            let existingData = { fav: [] };
            let result = { success: true, task: 'none' };

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

    readAll: async (filePath = path.join(favouriteDir, 'fav.json')) => {
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
    read: async (filename) => {
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

    list: async (subdir = '') => {
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

    formatDate: async (isoString) => {
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

    // Environment info
    isDev: async () => ipcRenderer.invoke('get-dev-status'),
    appVersion: async () => ipcRenderer.invoke('get-app-version')
};

// ==================== AUDIO PLAYER API ====================
let audioContext;
let audioBuffer;
let sourceNode;
let pauseTime = 0;
let startTime = 0;
let isManualStop = false;
let currentOffset = 0;

function playFrom(offset = 0) {
    if (!audioBuffer) return;

    if (sourceNode) {
        try { sourceNode.stop(); } catch { }
        sourceNode.disconnect();
    }

    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioContext.destination);
    startTime = audioContext.currentTime - offset;
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
    play: async (filePath = null) => {
        try {
            if (!audioContext) audioContext = new AudioContext();

            const fileData = fs.readFileSync(filePath);
            const arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength);

            if (arrayBuffer.byteLength === 0) throw new Error("Empty audio buffer");

            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            playFrom(0);
            return true;
        } catch (err) {
            console.error("Playback error:", err);
            return false;
        }
    },

    pause: () => {
        if (sourceNode) {
            isManualStop = true;
            sourceNode.stop();
            pauseTime = audioContext.currentTime - startTime;
            sourceNode = null;
        }
        return "paused";
    },

    resume: (time = null) => {
        pauseTime = time ? time : pauseTime;
        if (audioBuffer && pauseTime) {
            playFrom(pauseTime);
            pauseTime = 0;
            return "resumed";
        }
        return "Nothing to resume";
    },

    stop: () => {
        isManualStop = true;
        if (sourceNode) {
            sourceNode.stop();
            sourceNode = null;
        }
        audioBuffer = null;
        pauseTime = 0;
        currentOffset = 0;
        return "stopped";
    },

    seek: (seconds) => {
        if (!audioBuffer) return "No audio loaded";
        const offset = Math.min(Math.max(0, seconds), audioBuffer.duration);
        playFrom(offset);
        return `Seeked to ${offset.toFixed(2)}s`;
    },

    fastForward: (seconds = 5) => {
        if (!audioBuffer) return "No audio loaded";
        let newOffset = currentOffset + seconds;
        if (newOffset >= audioBuffer.duration) newOffset = audioBuffer.duration - 0.1;
        playFrom(newOffset);
        return newOffset.toFixed(2);
    },

    rewind: (seconds = 5) => {
        if (!audioBuffer) return "No audio loaded";
        let newOffset = currentOffset - seconds;
        if (newOffset < 0) newOffset = 0;
        playFrom(newOffset);
        return newOffset.toFixed(2);
    },

    getDuration: () => audioBuffer?.duration || 0,
    getCurrentTime: () => currentOffset,
    isPlaying: () => sourceNode !== null && !isManualStop
};

// ==================== SETTINGS API (via IPC) ====================
const settingsApi = {
    get: () => ipcRenderer.invoke('get-settings'),
    save: (settings) => ipcRenderer.invoke('save-settings', settings),
    reset: () => ipcRenderer.invoke('reset-settings')
};

// ==================== THEME API ====================
const themeApi = {
    // Set initial icon based on system theme
    init: () => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        ipcRenderer.send('theme-changed', isDarkMode);

        // Listen for theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            ipcRenderer.send('theme-changed', e.matches);
        });
    },

    getCurrent: () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },

    toggle: () => {
        // This would need main process support to actually change theme
        ipcRenderer.send('toggle-theme');
    }
};

// ==================== EXPOSE APIS ====================
contextBridge.exposeInMainWorld('ubook', {
    // Core APIs
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
