"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const child_process_1 = require("child_process");
const ttsValidation_1 = require("./utils/ttsValidation");
// Base directories with types
const BaseDir = path_1.default.join(os_1.default.homedir(), '.UBookDesk');
const notesDir = path_1.default.join(BaseDir, '.notes');
const favouriteDir = path_1.default.join(BaseDir, '.favourites');
const bookmarkDir = path_1.default.join(BaseDir, '.bookmark');
const cacheDir = path_1.default.join(BaseDir, '.cache');
const configDir = path_1.default.join(BaseDir, 'config');
// Ensure base directories exist
[BaseDir, notesDir, favouriteDir, bookmarkDir, cacheDir, configDir].forEach((dir) => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
// ==================== CONFIG API ====================
const configApi = {
    init: async () => {
        const configPath = path_1.default.join(configDir, 'config.json');
        const picowavePath = await electron_1.ipcRenderer.invoke('get-picowave-path');
        if (!fs_1.default.existsSync(configPath)) {
            const defaultConfig = {
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
            await fs_1.default.promises.writeFile(configPath, JSON.stringify(defaultConfig, null, 2));
            return defaultConfig;
        }
        return configApi.read();
    },
    read: async () => {
        const configPath = path_1.default.join(configDir, 'config.json');
        try {
            if (fs_1.default.existsSync(configPath)) {
                const data = await fs_1.default.promises.readFile(configPath, 'utf-8');
                return JSON.parse(data);
            }
            return configApi.init();
        }
        catch (err) {
            console.error('Error reading config:', err);
            return false;
        }
    },
    update: async (newConfig) => {
        const configPath = path_1.default.join(configDir, 'config.json');
        try {
            await fs_1.default.promises.writeFile(configPath, JSON.stringify(newConfig, null, 2));
            return true;
        }
        catch (err) {
            console.error('Error updating config:', err);
            return false;
        }
    },
    updateTTS: async (ttsConfig) => {
        console.log(ttsConfig);
        const config = await configApi.read();
        if (config && typeof config === 'object') {
            config.tts = { ...config.tts, ...ttsConfig };
            return configApi.update(config);
        }
        return false;
    },
    reset: async () => {
        const configPath = path_1.default.join(configDir, 'config.json');
        try {
            if (fs_1.default.existsSync(configPath)) {
                await fs_1.default.promises.unlink(configPath);
            }
            return configApi.init();
        }
        catch (err) {
            console.error('Error resetting config:', err);
            return false;
        }
    }
};
// ==================== TTS API ====================
const ttsApi = {
    generate: async (text, engine = null) => {
        if (!text || !text.trim())
            return null;
        const config = await configApi.read();
        if (!config || typeof config !== 'object')
            return null;
        const ttsConfig = config.tts;
        const selectedEngine = engine || ttsConfig.engine || ttsConfig.defaultEngine.engine;
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
        const cacheFile = path_1.default.join(cacheDir, `tts_${Math.random().toString(36).substring(2, 10)}.wav`);
        const prepCommand = (config, cmd) => {
            if (config.inputType === 'file') {
                return cmd.replace('{file}', safeText).replace('{output}', cacheFile);
            }
            else if (config.inputType === 'text') {
                return cmd.replace('{text}', safeText).replace('{output}', cacheFile);
            }
            return false;
        };
        // Execute TTS command
        try {
            let command;
            if (selectedEngine && ttsConfig.command) {
                command = prepCommand(ttsConfig, ttsConfig.command);
            }
            else if (ttsConfig.defaultEngine) {
                command = prepCommand(ttsConfig.defaultEngine, ttsConfig.defaultEngine.command);
            }
            else {
                throw new Error('No valid TTS command configured');
            }
            if (command && typeof command === 'string') {
                await new Promise((resolve, reject) => {
                    (0, child_process_1.exec)(command, (error, stdout, stderr) => {
                        if (error || stderr) {
                            console.error('TTS execution error:', error || stderr, "Output", stdout);
                            reject(error);
                        }
                        else {
                            resolve();
                        }
                    });
                });
                // Verify file was created
                await fs_1.default.promises.access(cacheFile, fs_1.default.constants.F_OK);
                return cacheFile;
            }
            throw "Error: command not valid";
        }
        catch (err) {
            console.error('TTS generation failed:', err);
            return null;
        }
    },
    getEngines: async () => {
        const config = await configApi.read();
        const picowavePath = await electron_1.ipcRenderer.invoke('get-picowave-path');
        return (config && typeof config === 'object' && [config.tts?.engine, config.tts?.defaultEngine.name]) || ['ttskit3', picowavePath];
    },
    test: async () => {
        const testText = "This is a test of the text to speech system.";
        const result = await ttsApi.generate(testText);
        return result !== null;
    },
    stop: () => {
        // Implementation depends on how you want to handle stopping
        return true;
    }
};
// ==================== FILE SYSTEM API ====================
const fsApi = {
    mkdir: async (dir) => {
        try {
            if (!fs_1.default.existsSync(dir)) {
                fs_1.default.mkdirSync(dir, { recursive: true });
            }
            return true;
        }
        catch (err) {
            console.error('mkdir error:', err);
            return false;
        }
    },
    readDir: async (dir) => {
        try {
            return fs_1.default.readdirSync(dir);
        }
        catch (err) {
            console.error('readDir error:', err);
            return false;
        }
    },
    write: async (filePath, data) => {
        try {
            fs_1.default.writeFileSync(filePath, data);
            return true;
        }
        catch (err) {
            console.error('write error:', err);
            return false;
        }
    },
    read: async (filePath) => {
        try {
            if (fs_1.default.existsSync(filePath)) {
                return JSON.parse(fs_1.default.readFileSync(filePath, 'utf-8'));
            }
            return false;
        }
        catch (err) {
            console.error('read error:', err);
            return false;
        }
    },
    delete: (filePath) => {
        try {
            if (fs_1.default.existsSync(filePath)) {
                fs_1.default.rmSync(filePath);
                return true;
            }
            return false;
        }
        catch (err) {
            console.error('delete error:', err);
            return false;
        }
    },
    join: (...paths) => path_1.default.join(...paths),
    basename: (filePath, ext) => path_1.default.basename(filePath, ext),
    extname: (filePath) => path_1.default.extname(filePath),
    dirname: (filePath) => path_1.default.dirname(filePath),
    exists: (filePath) => fs_1.default.existsSync(filePath),
    stat: (filePath) => fs_1.default.statSync(filePath),
    rename: (oldPath, newPath) => {
        try {
            fs_1.default.renameSync(oldPath, newPath);
            return true;
        }
        catch (err) {
            console.error('rename error:', err);
            return false;
        }
    },
    trash: (filePath) => {
        try {
            if (!fs_1.default.existsSync(filePath))
                return false;
            const platform = os_1.default.platform();
            let trashPath;
            if (platform === 'win32') {
                trashPath = path_1.default.join(process.env.APPDATA || '', 'Microsoft', 'Windows', 'Recycle Bin');
            }
            else if (platform === 'darwin') {
                trashPath = path_1.default.join(os_1.default.homedir(), '.Trash');
            }
            else if (platform === 'linux') {
                trashPath = path_1.default.join(os_1.default.homedir(), '.local', 'share', 'Trash', 'files');
                if (!fs_1.default.existsSync(trashPath)) {
                    fs_1.default.mkdirSync(trashPath, { recursive: true });
                }
            }
            else {
                return false;
            }
            const fileName = path_1.default.basename(filePath);
            const newFilePath = path_1.default.join(trashPath, fileName);
            // Handle filename conflicts
            let finalPath = newFilePath;
            let counter = 1;
            while (fs_1.default.existsSync(finalPath)) {
                const ext = path_1.default.extname(fileName);
                const name = path_1.default.basename(fileName, ext);
                finalPath = path_1.default.join(trashPath, `${name} (${counter})${ext}`);
                counter++;
            }
            fs_1.default.renameSync(filePath, finalPath);
            return true;
        }
        catch (err) {
            console.error('trash error:', err);
            return false;
        }
    },
    homedir: () => os_1.default.homedir(),
    downloads: () => path_1.default.join(os_1.default.homedir(), 'Downloads'),
    temp: () => os_1.default.tmpdir()
};
// ==================== NOTES API ====================
const notesApi = {
    save: async (note, filePath = path_1.default.join(notesDir, 'notes.json')) => {
        try {
            let data = { notes: [] };
            if (fs_1.default.existsSync(filePath)) {
                data = JSON.parse(await fs_1.default.promises.readFile(filePath, 'utf-8'));
            }
            data.notes.push(note);
            await fs_1.default.promises.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        }
        catch (err) {
            console.error('saveNote error:', err);
            return false;
        }
    },
    readAll: async (filePath = path_1.default.join(notesDir, 'notes.json')) => {
        try {
            if (fs_1.default.existsSync(filePath)) {
                return JSON.parse(await fs_1.default.promises.readFile(filePath, 'utf-8'));
            }
            return { notes: [] };
        }
        catch (err) {
            console.error('readNotes error:', err);
            return false;
        }
    },
    delete: async (noteId, filePath = path_1.default.join(notesDir, 'notes.json')) => {
        try {
            if (!noteId || !fs_1.default.existsSync(filePath))
                return false;
            const data = JSON.parse(await fs_1.default.promises.readFile(filePath, 'utf-8'));
            data.notes = data.notes.filter(note => note.timestamp !== noteId);
            await fs_1.default.promises.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        }
        catch (err) {
            console.error('deleteNote error:', err);
            return false;
        }
    },
    update: async (noteId, updatedNote, filePath = path_1.default.join(notesDir, 'notes.json')) => {
        try {
            if (!noteId || !fs_1.default.existsSync(filePath))
                return false;
            const data = JSON.parse(await fs_1.default.promises.readFile(filePath, 'utf-8'));
            const index = data.notes.findIndex(note => note.timestamp === noteId);
            if (index !== -1) {
                data.notes[index] = { ...data.notes[index], ...updatedNote, timestamp: noteId };
                await fs_1.default.promises.writeFile(filePath, JSON.stringify(data, null, 2));
                return true;
            }
            return false;
        }
        catch (err) {
            console.error('updateNote error:', err);
            return false;
        }
    }
};
// ==================== BOOKMARKS API ====================
const bookmarksApi = {
    toggle: async (data, filePath = path_1.default.join(bookmarkDir, 'bookmark.json')) => {
        try {
            let existingData = { bookmark: [] };
            let result = { success: true, task: 'none' };
            if (fs_1.default.existsSync(filePath)) {
                const content = await fs_1.default.promises.readFile(filePath, 'utf-8');
                existingData = JSON.parse(content || '{"bookmark": []}');
            }
            const index = existingData.bookmark.findIndex(bookmark => bookmark.part_id === data.part_id &&
                bookmark.paper_id === data.paper_id &&
                bookmark.section_number === data.section_number);
            if (index !== -1) {
                existingData.bookmark.splice(index, 1);
                result.task = 'remove';
            }
            else {
                existingData.bookmark.push({ ...data, addedAt: new Date().toISOString() });
                result.task = 'add';
            }
            await fs_1.default.promises.writeFile(filePath, JSON.stringify(existingData, null, 2));
            return result;
        }
        catch (err) {
            console.error('toggleBookmark error:', err);
            return { success: false, task: 'error' };
        }
    },
    readAll: async (filePath = path_1.default.join(bookmarkDir, 'bookmark.json')) => {
        try {
            if (fs_1.default.existsSync(filePath)) {
                return JSON.parse(await fs_1.default.promises.readFile(filePath, 'utf-8'));
            }
            return { bookmark: [] };
        }
        catch (err) {
            console.error('readBookmarks error:', err);
            return false;
        }
    },
    delete: async (bookmarkId, filePath = path_1.default.join(bookmarkDir, 'bookmark.json')) => {
        try {
            if (!fs_1.default.existsSync(filePath))
                return false;
            const data = JSON.parse(await fs_1.default.promises.readFile(filePath, 'utf-8'));
            data.bookmark = data.bookmark.filter(b => b.id !== bookmarkId);
            await fs_1.default.promises.writeFile(filePath, JSON.stringify(data, null, 2));
            return true;
        }
        catch (err) {
            console.error('deleteBookmark error:', err);
            return false;
        }
    }
};
// ==================== FAVOURITES API ====================
const favouritesApi = {
    toggle: async (data, filePath = path_1.default.join(favouriteDir, 'fav.json')) => {
        try {
            let existingData = { fav: [] };
            let result = { success: true, task: 'none' };
            if (fs_1.default.existsSync(filePath)) {
                const content = await fs_1.default.promises.readFile(filePath, 'utf-8');
                existingData = JSON.parse(content || '{"fav": []}');
            }
            const index = existingData.fav.findIndex(fav => fav.part_id === data.part_id &&
                fav.paper_id === data.paper_id &&
                fav.section_number === data.section_number);
            if (index !== -1) {
                existingData.fav.splice(index, 1);
                result.task = 'remove';
            }
            else {
                existingData.fav.push({ ...data, addedAt: new Date().toISOString() });
                result.task = 'add';
            }
            await fs_1.default.promises.writeFile(filePath, JSON.stringify(existingData, null, 2));
            return result;
        }
        catch (err) {
            console.error('toggleFavourite error:', err);
            return { success: false, task: 'error' };
        }
    },
    readAll: async (filePath = path_1.default.join(favouriteDir, 'fav.json')) => {
        try {
            if (fs_1.default.existsSync(filePath)) {
                return JSON.parse(await fs_1.default.promises.readFile(filePath, 'utf-8'));
            }
            return { fav: [] };
        }
        catch (err) {
            console.error('readFavourites error:', err);
            return false;
        }
    }
};
// ==================== CONTENT API ====================
const contentApi = {
    read: async (filename) => {
        try {
            const basePath = path_1.default.resolve(__dirname, '../assets/files/');
            const filePath = path_1.default.join(basePath, filename);
            if (!fs_1.default.existsSync(filePath))
                return false;
            const raw = await fs_1.default.promises.readFile(filePath, 'utf-8');
            return JSON.parse(raw);
        }
        catch (err) {
            console.error('readContent error:', err);
            return false;
        }
    },
    list: async (subdir = '') => {
        try {
            const basePath = path_1.default.resolve(__dirname, '../assets/files/', subdir);
            if (!fs_1.default.existsSync(basePath))
                return [];
            const files = await fs_1.default.promises.readdir(basePath);
            return files.filter(file => file.endsWith('.json'));
        }
        catch (err) {
            console.error('listContent error:', err);
            return [];
        }
    }
};
// ==================== SYSTEM API ====================
const systemApi = {
    platform: os_1.default.platform(),
    homedir: os_1.default.homedir(),
    cpus: os_1.default.cpus(),
    totalmem: os_1.default.totalmem(),
    freemem: os_1.default.freemem(),
    uptime: os_1.default.uptime(),
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
    isDev: async () => electron_1.ipcRenderer.invoke('get-dev-status'),
    appVersion: async () => electron_1.ipcRenderer.invoke('get-app-version')
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
    if (!audioBuffer)
        return;
    if (sourceNode) {
        try {
            sourceNode.stop();
        }
        catch { }
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
        }
        else {
            isManualStop = false;
        }
    };
    sourceNode.start(0, offset);
}
const playerApi = {
    play: async (filePath = null) => {
        try {
            if (!audioContext)
                audioContext = new AudioContext();
            const fileData = fs_1.default.readFileSync(filePath);
            const arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength);
            if (arrayBuffer.byteLength === 0)
                throw new Error("Empty audio buffer");
            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            playFrom(0);
            return true;
        }
        catch (err) {
            console.error("Playback error:", err);
            return false;
        }
    },
    pause: () => {
        if (sourceNode) {
            isManualStop = true;
            sourceNode.stop();
            pauseTime = audioContext.currentTime - startTime;
            sourceNode = undefined;
        }
        return "paused";
    },
    resume: (time = null) => {
        pauseTime = time !== null ? time : pauseTime;
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
            sourceNode = undefined;
        }
        audioBuffer = undefined;
        pauseTime = 0;
        currentOffset = 0;
        return "stopped";
    },
    seek: (seconds) => {
        if (!audioBuffer)
            return "No audio loaded";
        const offset = Math.min(Math.max(0, seconds), audioBuffer.duration);
        playFrom(offset);
        return `Seeked to ${offset.toFixed(2)}s`;
    },
    fastForward: (seconds = 5) => {
        if (!audioBuffer)
            return "No audio loaded";
        let newOffset = currentOffset + seconds;
        if (newOffset >= audioBuffer.duration)
            newOffset = audioBuffer.duration - 0.1;
        playFrom(newOffset);
        return newOffset.toFixed(2);
    },
    rewind: (seconds = 5) => {
        if (!audioBuffer)
            return "No audio loaded";
        let newOffset = currentOffset - seconds;
        if (newOffset < 0)
            newOffset = 0;
        playFrom(newOffset);
        return newOffset.toFixed(2);
    },
    getDuration: () => audioBuffer?.duration || 0,
    getCurrentTime: () => currentOffset,
    isPlaying: () => sourceNode !== null && !isManualStop
};
// ==================== SETTINGS API (via IPC) ====================
const settingsApi = {
    get: () => electron_1.ipcRenderer.invoke('get-settings'),
    save: (settings) => electron_1.ipcRenderer.invoke('save-settings', settings),
    reset: () => electron_1.ipcRenderer.invoke('reset-settings')
};
// ==================== THEME API ====================
const themeApi = {
    init: () => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        electron_1.ipcRenderer.send('theme-changed', isDarkMode);
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            electron_1.ipcRenderer.send('theme-changed', e.matches);
        });
    },
    getCurrent: () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    },
    toggle: () => {
        electron_1.ipcRenderer.send('toggle-theme');
    }
};
// ==================== EXPOSE APIS ====================
electron_1.contextBridge.exposeInMainWorld('ubook', {
    config: configApi,
    tts: ttsApi,
    TTSValidator: ttsValidation_1.TTSValidator,
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
//# sourceMappingURL=preload.js.map