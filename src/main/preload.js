const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

contextBridge.exposeInMainWorld('global', window);

const BaseDir = path.join(os.homedir(), '.UBookDesk');
const notesDir = path.join(BaseDir, '.saveNotes');
const favouriteDir = path.join(BaseDir, '.favourites');
const bookmarkDir = path.join(BaseDir, '.bookmark');
const cacheDir = path.join(BaseDir, '.cache');

contextBridge.exposeInMainWorld('api', {
    getDownloadsPath: () => {
        const downloadsPath = path.join(os.homedir(), 'Downloads');
        return downloadsPath;
    },

    home_dir: () => {
        return os.homedir();
    },
    mkdir: async (dir) => {
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    write: async (path, data) => {
        try {
            // Remove first item in the array before saving
            //data.shift()

            //data = JSON.stringify(data, null, 2)

            fs.writeFileSync(path, data);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    read: async (fpath) => {
        try {
            if (fs.statSync) {
                let data = JSON.parse(fs.readFileSync(fpath, 'utf-8'));
                // Add compartibility feature to maintain conversations instegrity!
                return data
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    saveNote: async (newNote, fpath = path.join(notesDir, 'notes.json')) => {
        try {
            // Check if file exists and is accessible
            await fs.promises.access(fpath, fs.constants.F_OK | fs.constants.R_OK);

            // Read the existing file content
            const existingData = JSON.parse(await fs.promises.readFile(fpath, 'utf-8'));

            // Add the new note to the existing data
            existingData.notes.push(newNote);

            // Write the updated data back to the file
            await fs.promises.writeFile(fpath, JSON.stringify(existingData, null, 2));

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    readNotes: async (fpath = path.join(notesDir, 'notes.json')) => {
        try {
            // Check if file exists and is accessible
            await fs.promises.access(fpath, fs.constants.F_OK | fs.constants.R_OK);

            // Read the existing file content
            const data = JSON.parse(await fs.promises.readFile(fpath, 'utf-8'));

            return data;
        } catch (err) {
            console.log(err);
            return false;
        }
    },

    addBookmark: async (data, fpath = path.join(bookmarkDir, 'bookmark.json')) => {
        try {
            // Ensure file exists, otherwise initialize with default structure
            let existingData = { bookmark: [] };

            let _return = ''

            if (fs.existsSync(fpath)) {
                const fileContent = await fs.promises.readFile(fpath, 'utf-8');
                existingData = JSON.parse(fileContent || '{"bookmark": []}');
            }

            console.log(existingData)
            // Check if the bookmark already exists
            const index = existingData.bookmark.findIndex(bookmark =>
                bookmark.part_id === data.part_id &&
                bookmark.paper_id === data.paper_id &&
                bookmark.section_number === data.section_number
            );

            if (index !== -1) {
                // If it exists, remove it
                existingData.bookmark.splice(index, 1);
                _return = { 'success': true, 'task': 'remove' };
            } else {
                // Otherwise, add it
                existingData.bookmark.push(data);
                _return = { 'success': true, 'task': 'add' };
            }

            // Save updated bookmarks
            await fs.promises.writeFile(fpath, JSON.stringify(existingData, null, 2));
            return _return;

        } catch (err) {
            console.error('Error in addBookmark:', err);
            return { 'success': false, 'task': 'any' };
        }
    },
    addFavourite: async (data, fpath = path.join(favouriteDir, 'fav.json')) => {
        try {
            // Ensure file exists, otherwise initialize with default structure
            let existingData = { fav: [] };

            let _return = '';

            if (fs.existsSync(fpath)) {
                const fileContent = await fs.promises.readFile(fpath, 'utf-8');
                existingData = JSON.parse(fileContent || '{"fav": []}');
            }

            console.log(existingData)
            // Check if the bookmark already exists
            const index = existingData.fav.findIndex(fav =>
                fav.part_id === data.part_id &&
                fav.paper_id === data.paper_id &&
                fav.section_number === data.section_number
            );

            if (index !== -1) {
                // If it exists, remove it
                existingData.fav.splice(index, 1);
                _return = { 'success': true, 'task': 'remove' };
            } else {
                // Otherwise, add it
                existingData.fav.push(data);
                _return = { 'success': true, 'task': 'add' };
            }

            // Save updated bookmarks
            await fs.promises.writeFile(fpath, JSON.stringify(existingData, null, 2));
            return _return

        } catch (err) {
            console.error('Error in addFavourite:', err);
            return { 'success': false, 'task': 'any' };
        }
    },

    readBookmarks: async (fpath = path.join(bookmarkDir, 'bookmark.json')) => {
        try {
            // Check if file exists and is accessible
            await fs.promises.access(fpath, fs.constants.F_OK | fs.constants.R_OK);

            // Read the existing file content
            const data = JSON.parse(await fs.promises.readFile(fpath, 'utf-8'));

            return data;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    readFavourites: async (fpath = path.join(favouriteDir, 'fav.json')) => {
        try {
            // Check if file exists and is accessible
            await fs.promises.access(fpath, fs.constants.F_OK | fs.constants.R_OK);

            // Read the existing file content
            const data = JSON.parse(await fs.promises.readFile(fpath, 'utf-8'));

            return data;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    readContent: async (filename) => {
        try {
            const basePath = path.resolve(__dirname, '../assets/files/');
            const filePath = path.join(basePath, filename);


            // Check if file exists and is accessible
            await fs.promises.access(filePath, fs.constants.F_OK | fs.constants.R_OK);

            const raw = await fs.promises.readFile(filePath, 'utf-8');
            const data = JSON.parse(raw);

            // Future-proof: Maintain conversation integrity here
            // e.g., data = normalizeConversationData(data)

            return data;
        } catch (err) {
            console.error('Error reading content:', err.message);
            return false;
        }
    },
    TTSConvert: async (text) => {
        if (!text.trim()) return null;

        const safeText = text
            .replace(/[\[\]]/g, "")
            .replace(/"/g, "")
            .replace(/—/g, ",");

        const cacheFile = path.join(cacheDir, `tts_${Math.random().toString(34).substring(3, 9)}.wav`);
        const AAC_command = `ttskit3 -t "${safeText}" -o "${cacheFile}" --threads 8 --speed 0.84`;

        const picowave = await ipcRenderer.invoke('get-picowave-path');
        const fallbackCmd = `echo "${safeText}" | ${picowave} -w "${cacheFile}"`;

        // Run primary command (ttskit3), fallback to Pico
        try {
            await new Promise((resolve, reject) => {
                exec(AAC_command, (err) => (err ? reject(err) : resolve()));
            });
        } catch (err) {
            console.log("Using FallBack Voice:", err)
            if (os.platform() === 'linux') {
                await new Promise((resolve, reject) => {
                    exec(fallbackCmd, (err) => (err ? reject(err) : resolve()));
                });
            } else {
                console.log('Fallback Not implemented on this OS');
            }
        }

        try {
            await fs.promises.access(cacheFile, fs.constants.F_OK);
            return cacheFile;
        } catch {
            return null;
        }
    },

    ReadAloud: async (_text, action = 'play') => {
        const text = _text || '';
        const TextCacheFile = path.join(cacheDir, `TText_${Math.random().toString(34).substring(3, 9)}.txt`);

        const cacheFile = path.join(cacheDir, `cfile_${Math.random().toString(34).substring(3, 9)}.wav`);

        // Ensure it's only for Linux
        if (os.platform() !== 'linux') {
            console.log('Not implemented on this OS');
            return false;
        }

        // Handle pause
        if (action === 'pause') {
            isManualStop = true;
            if (sourceNode) {
                sourceNode.stop();
                pauseTime = audioContext.currentTime - startTime;
                sourceNode = null;
            }
            // Reset after stop/pause
            setTimeout(() => { isManualStop = false; }, 100)
            return 'Paused';
        }

        // Handle resume
        if (action === 'resume') {
            if (audioBuffer && pauseTime) {
                sourceNode = audioContext.createBufferSource();
                sourceNode.buffer = audioBuffer;
                sourceNode.connect(audioContext.destination);
                startTime = audioContext.currentTime - pauseTime;
                console.log('stt:', startTime, 'pst:', pauseTime, 'act:', audioContext.currentTime)
                sourceNode.start(0, pauseTime);
                pauseTime = 0;

                sourceNode.onended = () => {
                    console.log(isManualStop)
                    if (!isManualStop) {
                        //setState(true);
                        setTimeout(() => {
                            document.dispatchEvent(new Event('play-finished'));
                        }, 0);
                    } else {
                        isManualStop = false; // reset it for next time
                    }
                };
                return 'Resumed';
            }
            return 'Nothing to resume';
        }

        // Handle stop
        if (action === 'stop') {
            isManualStop = true;
            if (sourceNode) {
                sourceNode.stop();
                sourceNode = null;
            }
            audioBuffer = null;
            pauseTime = 0;
            return 'Stopped';
        }

        // Fresh playback
        if (!text.trim()) return 'No text';

        const safeText = text
            .replace(/[\[\]]/g, "")
            .replace(/"/g, "")
            .replace(/—/g, ",")

        /*await fs.writeFile(TextCacheFile, safeText, 'utf8', (err) => {
            if (err) {
                console.log(`Error writing txt cache file: ${err}`)
            };
            console.log('The txt cache file has been saved!');
        })*/
        // Advance Audio Converter (AAC)
        //const AAC = 'ttskit2'
        const AAC_command = `ttskit3 -t ${safeText} -O ${cacheFile} --threads 8`

        console.log(`Cache File-: ${cacheFile}`)

        const picowave = await ipcRenderer.invoke('get-picowave-path');

        const command = `echo "${safeText}" | ${picowave} -w "${cacheFile}"`;

        // Robotic Voice Mode as fallback
        async function RBMV() {
            console.log("Iniating Robotic voice mode")
            await new Promise((resolve, reject) => {
                exec(command, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });
        }


        try {
            // Disable this option for now -> not very optimal
            // Advance mode first
            await new Promise((resolve, reject) => {
                try {
                    exec(AAC_command, (err) => {
                        //console.log(err)
                        if (err) {
                            return reject(err);
                        }
                        resolve();
                    });
                } catch (e) { }
            });
        } catch (e) {
            console.log("Error in ttskit2")
            RBMV()
        }

        try {
            // Check if file exists asynchronously
            await fs.promises.access(cacheFile, fs.constants.F_OK);
            // File exists-> continue
            // return true;
        } catch (err) {
            console.log(`Cache file not found: ${cacheFile}`)
            await RBMV();
        }

        try {

            if (!audioContext) audioContext = new AudioContext();

            const fileData = fs.readFileSync(cacheFile);

            const arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength);

            if (arrayBuffer.byteLength === 0) {
                console.error("Empty buffer")
            }
            try {
                audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            } catch (e) {
                console.error("DecodeError: Unable to decode audio data")
                return false
            }

            sourceNode = audioContext.createBufferSource();
            sourceNode.buffer = audioBuffer;
            sourceNode.connect(audioContext.destination);
            sourceNode.playbackRate.value = 1;
            startTime = audioContext.currentTime;

            // Dispatch play-finished event on end
            sourceNode.onended = () => {
                if (!isManualStop) {
                    //setState(true);
                    setTimeout(() => {
                        document.dispatchEvent(new Event('play-finished'));
                    }, 0);
                } else {
                    isManualStop = false; // reset it for next time
                }
            };

            sourceNode.start(0);
            return true;
        } catch (error) {
            console.error('TTS error:', error);
            return false;
        }
    },
    formatDate: async (isoString) => {
        const date = new Date(isoString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString(undefined, options);
    },
    readDir: async (dir) => {
        try {
            return fs.readdirSync(dir);
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    stat: (obj) => {
        return fs.statSync(obj);
    },
    getExt: (file) => {
        return path.extname(file);
    },
    getBasename: (_path, ext) => {
        return path.basename(_path, ext);
    },
    joinPath: (node, child) => {
        return path.join(node, child);
    },
    Rename: (original_path, target_path) => {
        try {
            fs.renameSync(original_path, target_path)
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    },
    deleteFile: (file_path) => {
        try {
            if (fs.statSync(file_path)) {
                fs.rmSync(file_path)
                // Move the item to the trash
                //trash([file])
                return true
            } else {
                console.log('Item not found')
                return false
            }
        } catch (err) {
            console.log(err);
        }
    },

    trashFile: (file_path) => {
        try {
            // Check if the file exists
            if (fs.existsSync(file_path)) {
                const platform = os.platform();
                let trashPath;

                // Determine the trash path based on the operating system
                if (platform === 'win32') {
                    // Windows
                    trashPath = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Recycle Bin');
                } else if (platform === 'darwin') {
                    // macOS
                    trashPath = path.join(os.homedir(), '.Trash');
                } else if (platform === 'linux') {
                    // Linux
                    trashPath = path.join(os.homedir(), '.local', 'share', 'Trash', 'files');
                } else {
                    console.log('Unsupported platform');
                    return false;
                }

                // Move the file to the trash
                const fileName = path.basename(file_path);
                const newFilePath = path.join(trashPath, fileName);

                fs.rename(file_path, newFilePath, (err) => {
                    if (err) {
                        console.error("Error moving file to trash:", err);
                        return false;
                    } else {
                        console.log("File moved to trash successfully");
                        return true;
                    }
                });
            } else {
                console.log('Item not found');
                return false;
            }
        } catch (err) {
            console.error("Error:", err);
            return false;
        }
    },
});

// preload.js (playback API)
let audioContext;
let audioBuffer;
let sourceNode;
let pauseTime = 0;
let startTime = 0;
let isManualStop = false;
let currentOffset = 0; // track where playback starts from

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

    // Make sure context time is in sync with actual playing time
    audioContext.currentTime = startTime

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

contextBridge.exposeInMainWorld('ReadAloud', {
    play: async (filePath = null) => {
        try {
            if (!audioContext) audioContext = new AudioContext();

            const fileData = fs.readFileSync(filePath);
            const arrayBuffer = fileData.buffer.slice(fileData.byteOffset, fileData.byteOffset + fileData.byteLength);

            if (arrayBuffer.byteLength === 0) throw new Error("Empty audio buffer");

            audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            playFrom(0); // fresh play
            return true;
        } catch (err) {
            console.error("Playback error:", err);
            return false;
        }
    },

    pause: () => {
        console.log("Pausing.")
        if (sourceNode) {
            isManualStop = true;
            sourceNode.stop();
            pauseTime = audioContext.currentTime - startTime;
            sourceNode = null;
        }
        return "Paused";
    },

    resume: (time = null) => {
        pauseTime = time ? time : pauseTime
        if (audioBuffer && pauseTime) {
            playFrom(pauseTime);
            pauseTime = 0;
            return "Resumed";
        }
        return "Nothing to resume";
    },

    stop: () => {
        console.log("stopping")
        isManualStop = true;
        if (sourceNode) {
            sourceNode.stop();
            sourceNode = null;
        }
        audioBuffer = null;
        pauseTime = 0;
        currentOffset = 0;
        return "Stopped";
    },

    // ✅ Seek support
    seek: (seconds) => {
        if (!audioBuffer) return "No audio loaded";

        const offset = Math.min(Math.max(0, seconds), audioBuffer.duration);
        playFrom(offset);
        console.log(`Seeked to ${offset.toFixed(2)}s`)

        return `Seeked to ${offset.toFixed(2)}s`;
    },

    // ✅ Fast forward
    fastForward: (seconds = 5) => {
        if (!audioBuffer) return "No audio loaded";

        let newOffset = currentOffset + seconds;
        if (newOffset >= audioBuffer.duration) newOffset = audioBuffer.duration - 0.1; // prevent overflow

        playFrom(newOffset);
        console.log(`Fast forwarded to ${newOffset.toFixed(2)}s`)
        return newOffset.toFixed(2)
    },

    // ✅ Rewind (fast backward)
    rewind: (seconds = 5) => {
        if (!audioBuffer) return "No audio loaded";

        let newOffset = currentOffset - seconds;
        if (newOffset < 0) newOffset = 0;

        playFrom(newOffset);
        console.log(`Rewinded to ${newOffset.toFixed(2)}s`)
        return newOffset.toFixed(2)
    }
});
