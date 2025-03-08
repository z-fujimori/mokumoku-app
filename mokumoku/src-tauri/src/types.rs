use serde::{Serialize, Deserialize};
use std::fmt;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LoginResponse {
    pub access_token: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Token {
    pub token: String
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StoreTask {
    pub name: String,
    pub assignment: f64,
    pub service: String,
    pub interval: i64
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct PlaseWithTask {
    pub plase_id: i64,
    pub plase: String,
    pub tree_state_id: i32,
    pub task_id: i32,
    pub name: String,
    pub assignment: f64,
    pub service: String,
    pub interval: i64
}


#[derive(Debug)]
pub enum Position {
    Left,
    Center,
    Right,
    Unknown,
}
impl Position {
    /// `i32` から `Position` に変換
    pub fn from_number(n: i32) -> Self {
        match n {
            1 => Position::Left,
            2 => Position::Center,
            3 => Position::Right,
            _ => Position::Unknown,
        }
    }
    /// `Position` を `"left"`, `"center"`, `"right"` に変換
    pub fn to_string(&self) -> &'static str {
        match self {
            Position::Left => "left",
            Position::Center => "center",
            Position::Right => "right",
            Position::Unknown => "unknown",
        }
    }
}
// `Display` を実装して `.to_string()` を自動適用
impl fmt::Display for Position {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.to_string())
    }
}


