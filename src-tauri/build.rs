fn main() {
    // Watch the frontend dist directory for changes
    println!("cargo:rerun-if-changed=../dist");
    tauri_build::build()
}
