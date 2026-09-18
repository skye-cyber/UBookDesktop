mod commands;
use std::fs;
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};

use serde::Serialize;
use tauri::{
    menu::{Menu, MenuItem, PredefinedMenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager, Runtime, WebviewUrl, WebviewWindowBuilder, WindowEvent,
};
use tauri_plugin_global_shortcut::{Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState};

// ---- Shared state --------------------------------------------------------

/// Mirrors Electron's `isQuiting` flag. When true, closing the main window
/// actually exits instead of hiding to tray.
struct AppState {
    is_quitting: AtomicBool,
}

/// Mirrors Electron's `iconPath` global — updated on theme change.
struct IconState {
    path: std::sync::Mutex<PathBuf>,
}

// ---- IPC commands (replacements for ipcMain.handle) ----------------------

/// Replaces `ipcMain.handle('get-app-version', ...)`
#[tauri::command]
fn get_app_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

/// Replaces `ipcMain.handle('get-dev-status', ...)`
#[tauri::command]
fn get_dev_status() -> bool {
    cfg!(debug_assertions)
}

/// Replaces `ipcMain.handle('show-documentation', ...)`
#[tauri::command]
async fn show_documentation(app: AppHandle) -> Result<(), String> {
    open_documentation_window(&app).map_err(|e| e.to_string())
}

// ---- Window helpers ------------------------------------------------------

/// Replaces `show_documentation()` / the doc-window branch of IPC.
fn open_documentation_window<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<()> {
    // If it's already open, focus it.
    if let Some(win) = app.get_webview_window("documentation") {
        let _ = win.set_focus();
        return Ok(());
    }

    // In dev, files live in `src/assets/`; in prod, in the resource bundle.
    let url = if cfg!(debug_assertions) {
        WebviewUrl::App("../src/assets/documentation.html".into())
    } else {
        WebviewUrl::App("assets/documentation.html".into())
    };

    WebviewWindowBuilder::new(app, "documentation", url)
    .title("Documentation")
    .inner_size(800.0, 600.0)
    .build()?;

    Ok(())
}

/// Called by the frontend once React has mounted.
/// Replaces the Electron `did-finish-load` → `mainWindow.show()` logic.
#[tauri::command]
async fn show_main_window(app: AppHandle) -> Result<(), String> {
    if let Some(main) = app.get_webview_window("main") {
        main.show().map_err(|e| e.to_string())?;
        main.set_focus().map_err(|e| e.to_string())?;
    }
    if let Some(splash) = app.get_webview_window("splash") {
        let _ = splash.close();
    }
    Ok(())
}

/// Replaces `createWindow()` — but the *main* window is declared in
/// `tauri.conf.json`. This function only handles the "show after load" logic
/// and the close-to-tray interception.
fn wire_main_window<R: Runtime>(app: &AppHandle<R>) {
    let _state = app.state::<AppState>();

    let Some(main) = app.get_webview_window("main") else {
        return;
    };

    // Close main window → hide to tray unless `is_quitting` is set.
    let main_clone = main.clone();
    main.on_window_event(move |event| {
        if let WindowEvent::CloseRequested { api, .. } = event {
            let state = main_clone.app_handle().state::<AppState>();
            if !state.is_quitting.load(Ordering::SeqCst) {
                api.prevent_close();
                let _ = main_clone.hide();
            }
        }
    });
}

// ---- Theme handling ------------------------------------------------------

/// Replaces `setAppIcon()` + the `theme-changed` IPC listener.
fn resolve_icon_path<R: Runtime>(app: &AppHandle<R>, _dark: bool) -> PathBuf {
    let filename = "ubookdesktop-rounded.png";

    if cfg!(debug_assertions) {
        std::env::current_dir()
        .unwrap_or_default()
        .join("../src")
        .join("assets")
        .join(filename)
    } else {
        app.path()
        .resource_dir()
        .unwrap_or_default()
        .join("assets")
        .join(filename)
    }
}

/// Called on startup and on every OS theme change.
fn apply_theme<R: Runtime>(app: &AppHandle<R>) {
    let dark = app
    .get_webview_window("main")
    .and_then(|w| w.theme().ok())
    .map(|t| matches!(t, tauri::Theme::Dark))
    .unwrap_or(false);

    let path = resolve_icon_path(app, dark);

    if let Some(state) = app.try_state::<IconState>() {
        if let Ok(mut guard) = state.path.lock() {
            *guard = path.clone();
        }
    }

    // Tray icon must be set via the tray API.
    if let Some(tray) = app.tray_by_id("main-tray") {
        if let Ok(img) = tauri::image::Image::from_path(&path) {
            let _ = tray.set_icon(Some(img));
        }
    }

    // Main window icon (taskbar / title bar on Linux/Windows).
    if let Some(win) = app.get_webview_window("main") {
        if let Ok(img) = tauri::image::Image::from_path(&path) {
            let _ = win.set_icon(img);
        }
    }
}

// ---- Tray ---------------------------------------------------------------

fn build_tray<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<()> {
    let show_i = MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
    let new_i = MenuItem::with_id(app, "new", "New window", true, None::<&str>)?;
    let help_i = MenuItem::with_id(app, "help", "Help", true, None::<&str>)?;
    let sep = PredefinedMenuItem::separator(app)?;
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&show_i, &new_i, &help_i, &sep, &quit_i])?;

    // let icon = tauri::image::Image::from_path("/home/skye/UBookDesktop/src/assets/ubookdesktop.png")?;
    let icon = tauri::image::Image::from_path(resolve_icon_path(app, false))?;

    let _tray = TrayIconBuilder::with_id("main-tray")
    .icon(icon)
    .tooltip("UBookDesktop")
    .menu(&menu)
    .show_menu_on_left_click(false)
    .on_menu_event(|app, event| match event.id.as_ref() {
        "show" => {
            if let Some(win) = app.get_webview_window("main") {
                let _ = win.show();
                let _ = win.set_focus();
            }
        }
        "new" => {
            // Reuse the main window rather than spawning duplicates.
            if let Some(win) = app.get_webview_window("main") {
                let _ = win.show();
                let _ = win.set_focus();
            }
        }
        "help" => {
            let _ = open_documentation_window(app);
        }
        "quit" => {
            app.state::<AppState>()
            .is_quitting
            .store(true, Ordering::SeqCst);
            app.exit(0);
        }
        _ => {}
    })
    .on_tray_icon_event(|tray, event| {
        // Double-click → show main window (Electron's `tray.on('double-click')`)
        if let TrayIconEvent::DoubleClick {
            button: MouseButton::Left,
            ..
        } = event
        {
            let app = tray.app_handle();
            if let Some(win) = app.get_webview_window("main") {
                let _ = win.show();
                let _ = win.set_focus();
            }
        }
        // Also handle single left-click show (common UX).
        if let TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } = event
        {
            let app = tray.app_handle();
            if let Some(win) = app.get_webview_window("main") {
                let _ = win.show();
            }
        }
    })
    .build(app)?;

    Ok(())
}

// ---- Global shortcuts ---------------------------------------------------

fn register_shortcuts<R: Runtime>(app: &AppHandle<R>) -> Result<(), Box<dyn std::error::Error>> {
    // F12 — toggle devtools
    let f12 = Shortcut::new(None, Code::F12);
    app.global_shortcut().on_shortcut(f12, |app, _sc, ev| {
        if ev.state == ShortcutState::Pressed {
            if let Some(win) = app.get_webview_window("main") {
                // if win.is_devtools_open() {
                //     win.close_devtools();
                // } else {
                //     win.open_devtools();
                // }
            }
        }
    })?;

    // Ctrl/Cmd + R — reload
    let reload = Shortcut::new(Some(Modifiers::CONTROL | Modifiers::META), Code::KeyR);
    app.global_shortcut().on_shortcut(reload, |app, _sc, ev| {
        if ev.state == ShortcutState::Pressed {
            if let Some(win) = app.get_webview_window("main") {
                let _ = win.eval("window.location.reload()");
            }
        }
    })?;

    // Ctrl/Cmd + Shift + R — force reload
    let force_reload = Shortcut::new(
        Some(Modifiers::CONTROL | Modifiers::META | Modifiers::SHIFT),
                                     Code::KeyR,
    );
    app.global_shortcut()
    .on_shortcut(force_reload, |app, _sc, ev| {
        if ev.state == ShortcutState::Pressed {
            if let Some(win) = app.get_webview_window("main") {
                let _ = win.eval("window.location.reload()");
            }
        }
    })?;

    // F11 — fullscreen (was commented out in Electron; keep disabled)
    // let f11 = Shortcut::new(None, Code::F11);
    // ...

    Ok(())
}

// ---- Filesystem prep (was prepDirectories / prepNoteFile / ...) ---------

fn prep_directories() -> std::io::Result<PathBuf> {
    let base = dirs::home_dir()
    .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "no home dir"))?
    .join(".UBookDesk");

    fs::create_dir_all(&base)?;
    for sub in [".saveNotes", ".favourites", ".bookmark", ".cache"] {
        fs::create_dir_all(base.join(sub))?;
    }
    Ok(base)
}

fn ensure_json_file(path: &PathBuf, initial: &str) -> std::io::Result<()> {
    if !path.exists() {
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }
        fs::write(path, initial)?;
    }
    Ok(())
}

fn prep_all_files(base: &PathBuf) -> std::io::Result<()> {
    ensure_json_file(
        &base.join(".saveNotes").join("notes.json"),
                     r#"{
                     "notes": []
}"#,
    )?;
    ensure_json_file(
        &base.join(".favourites").join("fav.json"),
                     r#"{
                     "fav": []
}"#,
    )?;
    ensure_json_file(
        &base.join(".bookmark").join("bookmark.json"),
                     r#"{
                     "bookmark": []
}"#,
    )?;
    Ok(())
}

// ---- App entry ----------------------------------------------------------

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_dialog::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_store::Builder::default().build())
    .plugin(tauri_plugin_shell::init())
    .plugin(tauri_plugin_global_shortcut::Builder::new().build())
    .manage(AppState {
        is_quitting: AtomicBool::new(false),
    })
    .manage(IconState {
        path: std::sync::Mutex::new(PathBuf::new()),
    })
    .invoke_handler(tauri::generate_handler![
        // app-level
        get_app_version,
        get_dev_status,
        show_documentation,
        show_main_window,
        commands::theme_notify,
        commands::system_total_mem,

        // picowave
        commands::get_picowave_path,
        // config
        commands::config_init,
        commands::config_read,
        commands::config_update,
        commands::config_update_tts,
        commands::config_reset,
        // tts
        commands::tts_generate,
        // fs
        commands::fs_mkdir,
        commands::fs_read_dir,
        commands::fs_write,
        commands::fs_read,
        commands::fs_delete,
        commands::fs_exists,
        commands::fs_rename,
        commands::fs_stat_size,
        commands::fs_trash,
        commands::fs_homedir,
        commands::fs_downloads,
        commands::fs_temp,
        // notes
        commands::notes_save,
        commands::notes_read_all,
        commands::notes_delete,
        commands::notes_update,
        // bookmarks
        commands::bookmarks_toggle,
        commands::bookmarks_read_all,
        commands::bookmarks_delete,
        // favourites
        commands::favourites_toggle,
        commands::favourites_read_all,
        // content
        commands::content_read,
        commands::content_list,
        // system
        commands::system_platform,
        commands::system_format_date,
        commands::check_executable_exists,
        commands::test_command_with_help,
    ])
    .setup(|app| {
        let handle = app.handle().clone();

        // 1. Prep ~/.UBookDesk tree (was `prepDirectories()` + file preps).
        if let Ok(base) = prep_directories() {
            let _ = prep_all_files(&base);
        }

        // 2. Register global shortcuts (was `setShortcuts()`).
        if let Err(e) = register_shortcuts(&handle) {
            eprintln!("shortcut registration failed: {e}");
        }

        // 3. Build tray (was `new Tray(...)`).
        build_tray(&handle)?;

        // 4. Wire main-window close → hide-to-tray.
        wire_main_window(&handle);

        // 5. Apply initial theme icon + subscribe to changes.
        apply_theme(&handle);
        if let Some(win) = app.get_webview_window("main") {
            let handle_for_theme = handle.clone();
            win.on_window_event(move |ev| {
                if let WindowEvent::ThemeChanged(_) = ev {
                    apply_theme(&handle_for_theme);
                }
            });
        }

        // 6. Close the splash once the main window is ready.
        if let Some(splash) = app.get_webview_window("splash") {
            let splash = splash.clone();
            if let Some(main) = app.get_webview_window("main") {
                let _main_for_wait = main.clone();
                main.on_window_event(move |ev| {
                    if let WindowEvent::Resized(_) = ev {
                        // no-op; Resized fires early
                    }
                });

                // Poll `is_visible` — Tauri doesn't expose a reliable
                // "dom-ready" for external pages, so we watch for the
                // main window becoming visible.
                let splash_clone = splash.clone();
                std::thread::spawn(move || {
                    // Give the frontend time to boot; the frontend
                    // can also emit `app-ready` and we can listen for it.
                    // Simplest: close splash after short delay once main shows.
                    std::thread::sleep(std::time::Duration::from_millis(1500));
                    let _ = splash_clone.close();
                });
            }
        }

        Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

pub fn apply_theme_for<R: Runtime>(app: &AppHandle<R>, dark: bool) {
    let filename = if dark { "ubookdesktop-squared.png" } else { "ubookdesktop.png" };
    let path = if cfg!(debug_assertions) {
        std::env::current_dir().unwrap_or_default().join("../src/assets").join(filename)
    } else {
        app.path().resource_dir().unwrap_or_default().join("assets").join(filename)
    };
    if let Some(tray) = app.tray_by_id("main-tray") {
        if let Ok(img) = tauri::image::Image::from_path(&path) {
            let _ = tray.set_icon(Some(img));
        }
    }
    if let Some(win) = app.get_webview_window("main") {
        if let Ok(img) = tauri::image::Image::from_path(&path) {
            let _ = win.set_icon(img);
        }
    }
}

// Silence unused import warning for Serialize used by future commands.
#[allow(dead_code)]
#[derive(Serialize)]
struct Placeholder {
    ok: bool,
}
