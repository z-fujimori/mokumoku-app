use serde::{Serialize, Deserialize};

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
    pub interval: i64
}

