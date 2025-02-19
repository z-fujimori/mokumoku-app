use tauri::{command, State};
use tauri_plugin_stronghold::stronghold::Stronghold;
use std::{panic::Location, sync::Mutex};

struct StrongholdStore {
    stronghold: Mutex<Stronghold>,
}

#[command]
pub fn store_session(state: State<StrongholdStore>, session: String) -> Result<(), String> {
    let mut stronghold = state.stronghold.lock().map_err(|_| "Lock Error")?;
    let location = Location::generic("vault", "session");

    // セッションデータを Stronghold に保存
    stronghold
        .write_to_store(location, session.as_bytes().to_vec(), None)
        .map_err(|_| "Failed to store session")?;

    Ok(())
}

#[command]
pub fn retrieve_session(state: State<StrongholdStore>) -> Result<String, String> {
    let stronghold = state.stronghold.lock().map_err(|_| "Lock Error")?;
    let location = Location::generic("vault", "session");

    if let Ok(Some(data)) = stronghold.read_from_store(&location) {
        Ok(String::from_utf8_lossy(&data).to_string())
    } else {
        Err("No session found".to_string())
    }
}

#[command]
pub fn clear_session(state: State<StrongholdStore>) -> Result<(), String> {
    let mut stronghold = state.stronghold.lock().map_err(|_| "Lock Error")?;
    let location = Location::generic("vault", "session");

    stronghold
        .delete_from_store(location)
        .map_err(|_| "Failed to clear session")?;

    Ok(())
}