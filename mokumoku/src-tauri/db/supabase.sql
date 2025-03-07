supabase

CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    assignment INTEGER NOT NULL,
    interval INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS stamps (
    id INTEGER PRIMARY KEY,
    task_id INTEGER NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);

->

CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL DEFAULT auth.uid(),
    name TEXT NOT NULL,
    assignment REAL NOT NULL,
    service TEXT NOT NULL,
    interval INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS stamps (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);
