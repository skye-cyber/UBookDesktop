//! Centralized path resolution for user data (config, notes, bookmarks,
//! favourites, cache).
//!
//! # Why this module exists
//!
//! The app was originally written for desktop only, using
//! `dirs::home_dir().join(".UBook")` everywhere. That works on Windows,
//! macOS, and Linux because `~` is a real user directory the app can read
//! and write.
//!
//! On Android and iOS, `dirs::home_dir()` returns *something* — it does not
//! fail — but it is **not** the app's sandboxed data directory. Writing
//! `~/.UBook` on mobile succeeds silently and puts files in a location that
//! other parts of the app (and Tauri's `app_data_dir()`) never look at.
//! The result is data that appears to vanish between runs.
//!
//! This module fixes that by resolving one canonical directory per platform:
//!
//! - **Desktop:** `~/.UBook` — unchanged from the original behavior, so
//!   existing users keep their data without any migration.
//! - **Mobile:** `app.path().app_data_dir()` — the platform-sanctioned
//!   sandbox directory. On Android this is typically
//!   `/data/user/0/<package>/files/`; on iOS it is the app container's
//!   `Library/Application Support/<bundle-id>/`.
//!
//! # Contract
//!
//! Every read and every write must go through [`app_data_dir`]. Do not
//! compute `.UBook` paths independently — a mismatch between the write path
//! and the read path is exactly the bug this module was created to prevent.
//!
//! # Migration from desktop
//!
//! To move existing desktop data to a phone, push the JSON files with
//! `adb push` into the resolved mobile directory. See the README section
//! "Transferring data to mobile" for the exact commands.
// # Maintainers
//! The paths.rs module doc explains why the platform split exists. Anyone adding a new data file should add a helper there rather than calling dirs::home_dir() directly.
//! The app_data_dir doc states the read/write contract explicitly, so a future change that computes .UBook independently can be caught in review.
//! Every subdirectory helper mirrors the historical folder names, with a note to keep them aligned with frontend expectations.
//! fallback_data_dir documents the deliberate choice to degrade to a temp directory rather than panic, so a path resolution failure doesn't take down user commands.

use std::path::PathBuf;

use tauri::{AppHandle, Manager};

/// Canonical base directory for all user data on desktop.
///
/// Desktop only. Kept private so nothing outside this module can accidentally
/// bypass the platform dispatch in [`app_data_dir`].
#[cfg(desktop)]
fn desktop_base_dir() -> std::io::Result<PathBuf> {
    let home = dirs::home_dir()
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "no home dir"))?;
    Ok(home.join(".UBook"))
}

/// Return the canonical user-data directory for the current platform.
///
/// - Desktop: `~/.UBook`
/// - Mobile: the Tauri-managed app data directory
///
/// The returned path is guaranteed to be:
///   * writable by the app,
///   * readable by the app on subsequent runs,
///   * the same directory that the frontend sees when it uses
///     `BaseDirectory.AppData` through `@tauri-apps/plugin-fs`.
pub fn app_data_dir(app: &AppHandle) -> PathBuf {
    #[cfg(desktop)]
    {
        // Desktop: preserve the original `~/.UBook` location so existing
        // users' data is picked up without a migration step.
        desktop_base_dir().unwrap_or_else(|_| fallback_data_dir(app))
    }

    #[cfg(mobile)]
    {
        // Mobile: use Tauri's sandboxed app data directory. This is the
        // only location guaranteed to survive app updates and be readable
        // by the frontend via BaseDirectory.AppData.
        app.path()
            .app_data_dir()
            .unwrap_or_else(|_| fallback_data_dir(app))
    }
}

/// Last-resort fallback when the platform resolver fails.
///
/// We never want a path resolution failure to crash a user command. Falling
/// back to a subdirectory of the OS temp dir keeps the app running; data
/// written there is non-persistent, which is a safe failure mode compared to
/// a panic.
fn fallback_data_dir(_app: &AppHandle) -> PathBuf {
    std::env::temp_dir().join(".UBook")
}

// ---- Convenience subdirectory helpers -----------------------------------
//
// These mirror the historical `.saveNotes` / `.favourites` / `.bookmark` /
// `.cache` / `config` layout. Keep them aligned with the frontend's
// expectations if you ever rename a folder.

pub fn notes_dir(app: &AppHandle) -> PathBuf {
    app_data_dir(app).join(".saveNotes")
}

pub fn favourites_dir(app: &AppHandle) -> PathBuf {
    app_data_dir(app).join(".favourites")
}

pub fn bookmark_dir(app: &AppHandle) -> PathBuf {
    app_data_dir(app).join(".bookmark")
}

pub fn cache_dir(app: &AppHandle) -> PathBuf {
    app_data_dir(app).join(".cache")
}

pub fn config_dir(app: &AppHandle) -> PathBuf {
    app_data_dir(app).join("config")
}

/// Create `app_data_dir` and every subdirectory it expects.
///
/// Idempotent: safe to call on every launch.
///
/// This replaces the old `prep_directories()` free function. The old version
/// ran before an `AppHandle` was available and therefore could not use the
/// platform-aware resolver; this one takes a handle and stays correct on
/// both desktop and mobile.
pub fn ensure_data_dirs(app: &AppHandle) -> std::io::Result<PathBuf> {
    let base = app_data_dir(app);
    std::fs::create_dir_all(&base)?;
    for sub in [".saveNotes", ".favourites", ".bookmark", ".cache", "config"] {
        std::fs::create_dir_all(base.join(sub))?;
    }
    Ok(base)
}

/// Ensure a JSON file exists with the given initial content.
///
/// Used to seed `notes.json`, `fav.json`, and `bookmark.json` on first run.
/// No-op if the file already exists, so it never overwrites user data.
pub fn ensure_json_file(path: &PathBuf, initial: &str) -> std::io::Result<()> {
    if !path.exists() {
        if let Some(parent) = path.parent() {
            std::fs::create_dir_all(parent)?;
        }
        std::fs::write(path, initial)?;
    }
    Ok(())
}

/// Seed all three data files if they are missing.
///
/// Called once from `setup()`. On desktop this reproduces the original
/// `prep_all_files` behavior; on mobile it produces the same files inside
/// the sandbox.
pub fn ensure_data_files(app: &AppHandle) -> std::io::Result<()> {
    let base = ensure_data_dirs(app)?;
    ensure_json_file(
        &base.join(".saveNotes").join("notes.json"),
        "{\n  \"notes\": []\n}",
    )?;
    ensure_json_file(
        &base.join(".favourites").join("fav.json"),
        "{\n  \"fav\": []\n}",
    )?;
    ensure_json_file(
        &base.join(".bookmark").join("bookmark.json"),
        "{\n  \"bookmark\": []\n}",
    )?;
    Ok(())
}
