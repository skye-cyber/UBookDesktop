use std::fs;
use std::path::{Path, PathBuf};
use std::process::Command;

use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::{AppHandle, Manager};

// ---------- Paths --------------------------------------------------------

fn base_dir() -> PathBuf {
    dirs::home_dir()
    .unwrap_or_else(|| PathBuf::from("."))
    .join(".UBook")
}

fn notes_dir() -> PathBuf { base_dir().join(".notes") }
fn favourite_dir() -> PathBuf { base_dir().join(".favourites") }
fn bookmark_dir() -> PathBuf { base_dir().join(".bookmark") }
fn cache_dir() -> PathBuf { base_dir().join(".cache") }
fn config_dir() -> PathBuf { base_dir().join("config") }

fn ensure_all_dirs() -> std::io::Result<()> {
    for d in [base_dir(), notes_dir(), favourite_dir(), bookmark_dir(), cache_dir(), config_dir()] {
        fs::create_dir_all(d)?;
    }
    Ok(())
}

// ---------- Config API ---------------------------------------------------

#[tauri::command]
pub fn config_init(app: AppHandle) -> Result<Value, String> {
    ensure_all_dirs().map_err(|e| e.to_string())?;
    let config_path = config_dir().join("config.json");

    if !config_path.exists() {
        let picowave = picowave_path_string(&app);
        let default = serde_json::json!({
            "tts": {
                "defaultEngine": {
                    "name": "picowave",
                    "engine": picowave,
                    "command": format!(r#"echo "{{safeText}}" | {} -w "{{cacheFile}}""#, picowave),
                                        "inputType": "text",
                                        "outputFormat": "wav",
                                        "maxTextLength": 1000
                },
                "engine": "ttskit3",
                "command": r#"ttskit3 --text "{text}" -o "{output}" --threads 8 --speed 0.86"#,
                "fallbackCommand": format!(r#"echo "{{text}}" | {} -w "{{output}}""#, picowave),
                                        "inputType": "text",
                                        "outputFormat": "wav",
                                        "maxTextLength": 1000
            },
            "appearance": { "theme": "system", "fontSize": 14 },
            "paths": {
                "notes": notes_dir().to_string_lossy(),
                                        "favourites": favourite_dir().to_string_lossy(),
                                        "bookmark": bookmark_dir().to_string_lossy(),
                                        "cache": cache_dir().to_string_lossy()
            }
        });
        fs::write(&config_path, serde_json::to_string_pretty(&default).unwrap())
        .map_err(|e| e.to_string())?;
        return Ok(default);
    }
    config_read()
}

#[tauri::command]
pub fn config_read() -> Result<Value, String> {
    let path = config_dir().join("config.json");
    if !path.exists() {
        return Err("config missing".into());
    }
    let raw = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&raw).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn config_update(new_config: Value) -> Result<bool, String> {
    let path = config_dir().join("config.json");
    fs::write(&path, serde_json::to_string_pretty(&new_config).unwrap())
    .map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
pub fn config_update_tts(patch: Value) -> Result<bool, String> {
    let mut cfg = config_read()?;
    if let Some(tts) = cfg.get_mut("tts") {
        if let (Some(obj), Some(patch_obj)) = (tts.as_object_mut(), patch.as_object()) {
            for (k, v) in patch_obj {
                obj.insert(k.clone(), v.clone());
            }
        }
    }
    config_update(cfg)
}

#[tauri::command]
pub fn config_reset(app: AppHandle) -> Result<Value, String> {
    let path = config_dir().join("config.json");
    if path.exists() {
        fs::remove_file(&path).map_err(|e| e.to_string())?;
    }
    config_init(app)
}

// ---------- TTS ----------------------------------------------------------

fn picowave_path_string(app: &AppHandle) -> String {
    if cfg!(debug_assertions) {
        std::env::current_dir()
        .unwrap_or_default()
        .join("src/common/pico_bundle/bin/pico2wave")
        .to_string_lossy()
        .to_string()
    } else {
        app.path()
        .resource_dir()
        .unwrap_or_default()
        .join("common/pico_bundle/bin/pico2wave")
        .to_string_lossy()
        .to_string()
    }
}

#[tauri::command]
pub fn get_picowave_path(app: AppHandle) -> String {
    picowave_path_string(&app)
}

#[tauri::command]
pub fn tts_generate(app: AppHandle, text: String, engine: Option<String>) -> Result<Option<String>, String> {
    if text.trim().is_empty() {
        return Ok(None);
    }

    let cfg = match config_read() {
        Ok(c) => c,
        Err(_) => config_init(app.clone())?,
    };
    let tts = cfg.get("tts").cloned().unwrap_or(Value::Null);

    let selected = engine
    .or_else(|| tts.get("engine").and_then(|v| v.as_str()).map(String::from))
    .unwrap_or_else(|| "ttskit3".to_string());

    let max_len = tts.get("maxTextLength").and_then(|v| v.as_u64()).unwrap_or(1000) as usize;
    let text = if text.len() > max_len { text[..max_len].to_string() } else { text };

    let safe_text = text
    .replace(['[', ']'], "")
    .replace(['“', '”'], "'")
    .replace('—', ", that is to say")
    .replace('\u{00A0}', " ");

    let cache_file = cache_dir().join(format!(
        "tts_{}.wav",
        uuid_like()
    ));
    let cache_file_s = cache_file.to_string_lossy().to_string();

    // Pick the command template
    let template: Option<String> = if let Some(cmd) = tts.get("command").and_then(|v| v.as_str()) {
        if selected == tts.get("engine").and_then(|v| v.as_str()).unwrap_or("") {
            Some(cmd.to_string())
        } else {
            None
        }
    } else {
        None
    }
    .or_else(|| {
        tts.get("defaultEngine")
        .and_then(|d| d.get("command"))
        .and_then(|v| v.as_str())
        .map(String::from)
    });

    let Some(cmd_tpl) = template else {
        return Err("No valid TTS command configured".into());
    };

    let input_type = tts
    .get("inputType")
    .and_then(|v| v.as_str())
    .unwrap_or("text");

    let command = match input_type {
        "file" => cmd_tpl
        .replace("{file}", &safe_text)
        .replace("{output}", &cache_file_s),
        _ => cmd_tpl
        .replace("{text}", &safe_text)
        .replace("{output}", &cache_file_s)
        .replace("{cacheFile}", &cache_file_s),
    };

    let status = if cfg!(target_os = "windows") {
        Command::new("cmd").args(["/C", &command]).status()
    } else {
        Command::new("sh").args(["-c", &command]).status()
    };

    match status {
        Ok(s) if s.success() && cache_file.exists() => Ok(Some(cache_file_s)),
        _ => Ok(None),
    }
}

fn uuid_like() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let nanos = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().subsec_nanos();
    format!("{:x}{:x}", nanos, std::process::id())
}

// ---------- FS API -------------------------------------------------------

#[tauri::command]
pub fn fs_mkdir(dir: String) -> Result<bool, String> {
    fs::create_dir_all(&dir).map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn fs_read_dir(dir: String) -> Result<Vec<String>, String> {
    let entries = fs::read_dir(&dir).map_err(|e| e.to_string())?;
    Ok(entries
    .filter_map(|e| e.ok())
    .map(|e| e.file_name().to_string_lossy().to_string())
    .collect())
}

#[tauri::command]
pub fn fs_write(file_path: String, data: String) -> Result<bool, String> {
    fs::write(&file_path, data).map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn fs_read(file_path: String) -> Result<Value, String> {
    let raw = fs::read_to_string(&file_path).map_err(|e| e.to_string())?;
    serde_json::from_str(&raw).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn fs_delete(file_path: String) -> Result<bool, String> {
    if Path::new(&file_path).exists() {
        fs::remove_file(&file_path).map(|_| true).map_err(|e| e.to_string())
    } else {
        Ok(false)
    }
}

#[tauri::command]
pub fn fs_exists(file_path: String) -> bool {
    Path::new(&file_path).exists()
}

#[tauri::command]
pub fn fs_rename(old_path: String, new_path: String) -> Result<bool, String> {
    fs::rename(&old_path, &new_path).map(|_| true).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn fs_stat_size(file_path: String) -> Result<u64, String> {
    fs::metadata(&file_path).map(|m| m.len()).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn fs_trash(file_path: String) -> Result<bool, String> {
    let p = PathBuf::from(&file_path);
    if !p.exists() {
        return Ok(false);
    }
    let trash = trash_dir();
    fs::create_dir_all(&trash).map_err(|e| e.to_string())?;

    let name = p.file_name().unwrap_or_default().to_string_lossy().to_string();
    let mut target = trash.join(&name);
    let mut i = 1;
    while target.exists() {
        let stem = p.file_stem().unwrap_or_default().to_string_lossy();
        let ext = p.extension().map(|e| format!(".{}", e.to_string_lossy())).unwrap_or_default();
        target = trash.join(format!("{} ({}){}", stem, i, ext));
        i += 1;
    }
    fs::rename(&p, &target).map(|_| true).map_err(|e| e.to_string())
}

fn trash_dir() -> PathBuf {
    #[cfg(target_os = "macos")]
    { dirs::home_dir().unwrap_or_default().join(".Trash") }
    #[cfg(target_os = "linux")]
    { dirs::home_dir().unwrap_or_default().join(".local/share/Trash/files") }
    #[cfg(target_os = "windows")]
    { dirs::data_dir().unwrap_or_default().join("Microsoft/Windows/Recycle Bin") }
}

#[tauri::command]
pub fn fs_homedir() -> String {
    dirs::home_dir().unwrap_or_default().to_string_lossy().to_string()
}

#[tauri::command]
pub fn fs_downloads() -> String {
    dirs::download_dir()
    .or_else(|| dirs::home_dir().map(|h| h.join("Downloads")))
    .unwrap_or_default()
    .to_string_lossy()
    .to_string()
}

#[tauri::command]
pub fn fs_temp() -> String {
    std::env::temp_dir().to_string_lossy().to_string()
}

// ---------- Notes --------------------------------------------------------

#[derive(Serialize, Deserialize)]
struct NotesFile { notes: Vec<Value> }

#[tauri::command]
pub fn notes_save(note: Value, file_path: Option<String>) -> Result<bool, String> {
    let path = file_path.unwrap_or_else(|| notes_dir().join("notes.json").to_string_lossy().to_string());
    let mut data: NotesFile = if Path::new(&path).exists() {
        serde_json::from_str(&fs::read_to_string(&path).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?
    } else {
        NotesFile { notes: vec![] }
    };
    data.notes.push(note);
    fs::write(&path, serde_json::to_string_pretty(&data).unwrap()).map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
pub fn notes_read_all(file_path: Option<String>) -> Result<Value, String> {
    let path = file_path.unwrap_or_else(|| notes_dir().join("notes.json").to_string_lossy().to_string());
    if !Path::new(&path).exists() {
        return Ok(serde_json::json!({ "notes": [] }));
    }
    let raw = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&raw).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn notes_delete(note_id: String, file_path: Option<String>) -> Result<bool, String> {
    let path = file_path.unwrap_or_else(|| notes_dir().join("notes.json").to_string_lossy().to_string());
    if !Path::new(&path).exists() { return Ok(false); }
    let mut data: NotesFile = serde_json::from_str(&fs::read_to_string(&path).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    data.notes.retain(|n| n.get("timestamp").and_then(|v| v.as_str()) != Some(&note_id));
    fs::write(&path, serde_json::to_string_pretty(&data).unwrap()).map_err(|e| e.to_string())?;
    Ok(true)
}

#[tauri::command]
pub fn notes_update(note_id: String, updated_note: Value, file_path: Option<String>) -> Result<bool, String> {
    let path = file_path.unwrap_or_else(|| notes_dir().join("notes.json").to_string_lossy().to_string());
    if !Path::new(&path).exists() { return Ok(false); }
    let mut data: NotesFile = serde_json::from_str(&fs::read_to_string(&path).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    if let Some(i) = data.notes.iter().position(|n| n.get("timestamp").and_then(|v| v.as_str()) == Some(&note_id)) {
        if let (Some(old), Some(patch)) = (data.notes[i].as_object_mut(), updated_note.as_object()) {
            for (k, v) in patch { old.insert(k.clone(), v.clone()); }
            old.insert("timestamp".into(), Value::String(note_id));
        }
        fs::write(&path, serde_json::to_string_pretty(&data).unwrap()).map_err(|e| e.to_string())?;
        Ok(true)
    } else {
        Ok(false)
    }
}

// ---------- Bookmarks ----------------------------------------------------

#[tauri::command]
pub fn bookmarks_toggle(data: Value, file_path: Option<String>) -> Result<Value, String> {
    let path = file_path.unwrap_or_else(|| bookmark_dir().join("bookmark.json").to_string_lossy().to_string());
    let mut root: Value = if Path::new(&path).exists() {
        serde_json::from_str(&fs::read_to_string(&path).map_err(|e| e.to_string())?).unwrap_or(serde_json::json!({"bookmark": []}))
    } else {
        serde_json::json!({"bookmark": []})
    };
    let arr = root.get_mut("bookmark").and_then(|v| v.as_array_mut()).ok_or("bad shape")?;
    let key = |v: &Value| (
        v.get("part_id").and_then(|x| x.as_i64()),
                           v.get("paper_id").and_then(|x| x.as_i64()),
                           v.get("section_number").and_then(|x| x.as_i64()),
    );
    let target = key(&data);
    let idx = arr.iter().position(|b| key(b) == target);
    let task = if let Some(i) = idx {
        arr.remove(i);
        "remove"
    } else {
        let mut with_added = data.clone();
        with_added.as_object_mut().map(|o| o.insert("addedAt".into(), Value::String(now_iso())));
        arr.push(with_added);
        "add"
    };
    fs::write(&path, serde_json::to_string_pretty(&root).unwrap()).map_err(|e| e.to_string())?;
    Ok(serde_json::json!({ "success": true, "task": task }))
}

#[tauri::command]
pub fn bookmarks_read_all(file_path: Option<String>) -> Result<Value, String> {
    let path = file_path.unwrap_or_else(|| bookmark_dir().join("bookmark.json").to_string_lossy().to_string());
    if !Path::new(&path).exists() { return Ok(serde_json::json!({"bookmark": []})); }
    let raw = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&raw).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn bookmarks_delete(bookmark_id: String, file_path: Option<String>) -> Result<bool, String> {
    let path = file_path.unwrap_or_else(|| bookmark_dir().join("bookmark.json").to_string_lossy().to_string());
    if !Path::new(&path).exists() { return Ok(false); }
    let mut root: Value = serde_json::from_str(&fs::read_to_string(&path).map_err(|e| e.to_string())?).map_err(|e| e.to_string())?;
    if let Some(arr) = root.get_mut("bookmark").and_then(|v| v.as_array_mut()) {
        arr.retain(|b| b.get("id").and_then(|v| v.as_str()) != Some(&bookmark_id));
    }
    fs::write(&path, serde_json::to_string_pretty(&root).unwrap()).map_err(|e| e.to_string())?;
    Ok(true)
}

// ---------- Favourites ---------------------------------------------------

#[tauri::command]
pub fn favourites_toggle(data: Value, file_path: Option<String>) -> Result<Value, String> {
    let path = file_path.unwrap_or_else(|| favourite_dir().join("fav.json").to_string_lossy().to_string());
    let mut root: Value = if Path::new(&path).exists() {
        serde_json::from_str(&fs::read_to_string(&path).map_err(|e| e.to_string())?).unwrap_or(serde_json::json!({"fav": []}))
    } else {
        serde_json::json!({"fav": []})
    };
    let arr = root.get_mut("fav").and_then(|v| v.as_array_mut()).ok_or("bad shape")?;
    let key = |v: &Value| (
        v.get("part_id").and_then(|x| x.as_i64()),
                           v.get("paper_id").and_then(|x| x.as_i64()),
                           v.get("section_number").and_then(|x| x.as_i64()),
    );
    let target = key(&data);
    let idx = arr.iter().position(|f| key(f) == target);
    let task = if let Some(i) = idx {
        arr.remove(i);
        "remove"
    } else {
        let mut with_added = data.clone();
        with_added.as_object_mut().map(|o| o.insert("addedAt".into(), Value::String(now_iso())));
        arr.push(with_added);
        "add"
    };
    fs::write(&path, serde_json::to_string_pretty(&root).unwrap()).map_err(|e| e.to_string())?;
    Ok(serde_json::json!({ "success": true, "task": task }))
}

#[tauri::command]
pub fn favourites_read_all(file_path: Option<String>) -> Result<Value, String> {
    let path = file_path.unwrap_or_else(|| favourite_dir().join("fav.json").to_string_lossy().to_string());
    if !Path::new(&path).exists() { return Ok(serde_json::json!({"fav": []})); }
    let raw = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&raw).map_err(|e| e.to_string())
}

// ---------- Content ------------------------------------------------------

#[tauri::command]
pub fn content_read(app: AppHandle, filename: String) -> Result<Value, String> {
    let base = if cfg!(debug_assertions) {
        std::env::current_dir().unwrap_or_default().join("../src/assets/files")
    } else {
        app.path().resource_dir().unwrap_or_default().join("assets/files")
    };
    let path = base.join(&filename);
    let raw = fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&raw).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn content_list(app: AppHandle, subdir: Option<String>) -> Result<Vec<String>, String> {
    let base = if cfg!(debug_assertions) {
        std::env::current_dir().unwrap_or_default().join("../src/assets/files")
    } else {
        app.path().resource_dir().unwrap_or_default().join("assets/files")
    };
    let dir = base.join(subdir.unwrap_or_default());
    if !dir.exists() { return Ok(vec![]); }
    Ok(fs::read_dir(dir)
    .map_err(|e| e.to_string())?
    .filter_map(|e| e.ok())
    .map(|e| e.file_name().to_string_lossy().to_string())
    .filter(|n| n.ends_with(".json"))
    .collect())
}

// ---------- System -------------------------------------------------------

#[tauri::command]
pub fn system_platform() -> String {
    std::env::consts::OS.to_string()
}

#[tauri::command]
pub fn system_total_mem() -> u64 {
    // sysinfo not pulled in to keep deps light; frontend uses navigator.deviceMemory
    0
}

#[tauri::command]
pub fn system_format_date(iso: String) -> String {
    iso // frontend can format with Intl.DateTimeFormat
}

fn now_iso() -> String {
    use std::time::{SystemTime, UNIX_EPOCH};
    let secs = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
    format!("{}", secs) // simple epoch; frontend can render
}

#[tauri::command]
pub fn theme_notify(_app: AppHandle, _is_dark: bool) {
    // Trigger the same icon swap as the native ThemeChanged event.
    // Reuse the public helper:
    // crate::apply_theme_for(&app, is_dark);
}

// ---------- TTS Validator ------------------------------------------------

#[derive(Serialize)]
pub struct ExecutableCheck {
    pub exists: bool,
    pub warning: Option<String>,
}

/// Replaces `TTSValidator.checkExecutableExists`.
///
/// Checks: (a) absolute path exists and is executable, or
///         (b) the binary is resolvable in the system PATH.
#[tauri::command]
pub fn check_executable_exists(executable: String) -> ExecutableCheck {
    use std::os::unix::fs::PermissionsExt;

    // Absolute or explicit path?
    let p = Path::new(&executable);
    if p.is_absolute() || executable.contains('/') || executable.contains('\\') {
        if !p.exists() {
            return ExecutableCheck { exists: false, warning: None };
        }
        let md = match fs::metadata(p) {
            Ok(m) => m,
            Err(_) => return ExecutableCheck { exists: false, warning: None },
        };
        if !md.is_file() {
            return ExecutableCheck {
                exists: false,
                warning: Some("Path exists but is not a file".into()),
            };
        }
        #[cfg(unix)]
        {
            if md.permissions().mode() & 0o111 == 0 {
                return ExecutableCheck {
                    exists: false,
                    warning: Some("File is not executable".into()),
                };
            }
        }
        return ExecutableCheck { exists: true, warning: None };
    }

    // Otherwise: resolve via PATH.
    match which_in_path(&executable) {
        Some(_) => ExecutableCheck { exists: true, warning: None },
        None => ExecutableCheck { exists: false, warning: None },
    }
}

fn which_in_path(bin: &str) -> Option<PathBuf> {
    let path_var = std::env::var_os("PATH")?;
    for dir in std::env::split_paths(&path_var) {
        let candidate = dir.join(bin);
        if candidate.is_file() {
            #[cfg(unix)]
            {
                use std::os::unix::fs::PermissionsExt;
                if let Ok(md) = fs::metadata(&candidate) {
                    if md.permissions().mode() & 0o111 != 0 {
                        return Some(candidate);
                    }
                }
            }
            #[cfg(not(unix))]
            {
                return Some(candidate);
            }
        }
        // Windows: also try `.exe` / `.cmd` / `.bat`
        #[cfg(windows)]
        {
            for ext in ["exe", "cmd", "bat", "ps1"] {
                let candidate = dir.join(format!("{}.{}", bin, ext));
                if candidate.is_file() {
                    return Some(candidate);
                }
            }
        }
    }
    None
}

#[derive(Serialize)]
pub struct HelpTestResult {
    pub success: bool,
    pub error: Option<String>,
}

/// Replaces `TTSValidator.testCommandWithHelp`.
///
/// Runs the command with `-h` appended, capturing exit code + stderr/stdout.
/// Returns `success: true` if the process exits 0 OR if its output contains
/// the words "usage" or "help" (many CLI tools exit non-zero for `-h`).
#[tauri::command]
pub async fn test_command_with_help(
    command: String,
    timeout_ms: Option<u64>,
) -> HelpTestResult {
    // Placeholder substitution — mirrors the TS version.
    let test_cmd = command
    .replace("{file}", "/tmp/test.txt")
    .replace("{text}", "test")
    .replace("{output}", "/tmp/output.wav");

    let with_help = if !test_cmd.contains("-h") && !test_cmd.contains("--help") {
        format!("{} -h", test_cmd)
    } else {
        test_cmd
    };

    // Run the command via the platform shell with a timeout.
    let timeout = std::time::Duration::from_millis(timeout_ms.unwrap_or(5000));
    let result = run_shell_with_timeout(&with_help, timeout);

    match result {
        Ok((code, stdout, stderr)) => {
            if code == Some(0) {
                return HelpTestResult { success: true, error: None };
            }
            let combined = format!("{}\n{}", stdout, stderr).to_lowercase();
            if combined.contains("usage") || combined.contains("help") {
                HelpTestResult { success: true, error: None }
            } else {
                HelpTestResult {
                    success: false,
                    error: Some(format!("exit code {:?}\n{}", code, combined)),
                }
            }
        }
        Err(e) => HelpTestResult { success: false, error: Some(e) },
    }
}

fn run_shell_with_timeout(
    cmd: &str,
    timeout: std::time::Duration,
) -> Result<(Option<i32>, String, String), String> {
    use std::process::{Command, Stdio};

    let mut child = if cfg!(target_os = "windows") {
        Command::new("cmd")
        .args(["/C", cmd])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
    } else {
        Command::new("sh")
        .args(["-c", cmd])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
    }
    .map_err(|e| e.to_string())?;

    // Simple polling loop for timeout (no extra deps).
    let start = std::time::Instant::now();
    loop {
        match child.try_wait() {
            Ok(Some(_status)) => break,
            Ok(None) => {
                if start.elapsed() >= timeout {
                    let _ = child.kill();
                    return Err("timeout".into());
                }
                std::thread::sleep(std::time::Duration::from_millis(25));
            }
            Err(e) => return Err(e.to_string()),
        }
    }

    let output = child.wait_with_output().map_err(|e| e.to_string())?;
    Ok((
        output.status.code(),
        String::from_utf8_lossy(&output.stdout).to_string(),
        String::from_utf8_lossy(&output.stderr).to_string(),
    ))
}
