const { contextBridge, ipcRenderer, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');
//const { exec } = require('child_process');


contextBridge.exposeInMainWorld('global', window);


contextBridge.exposeInMainWorld('electron', {
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
    read: async (path) => {
        try {
            if (fs.statSync) {
                let data = JSON.parse(fs.readFileSync(path, 'utf-8'));
                // Add compartibility feature to maintain conversations instegrity!
                return data
            }
        } catch (err) {
            console.log(err);
            return false;
        }
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
    Rename: (original_path, target_path) =>{
        try{
            fs.renameSync(original_path, target_path)
            return  true
        }catch (err){
            console.log(err)
            return false
        }
    },
    deleteFile: (file_path) => {
        try{
            if (fs.statSync(file_path)){
                fs.rmSync(file_path)
                // Move the item to the trash
                //trash([file])
                return true
            }else{
                console.log('Item not found')
                return false
            }
        }catch (err){
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
