

#[tauri::command]
pub fn midnight_event() -> () {
    println!("定期イベント");
}
