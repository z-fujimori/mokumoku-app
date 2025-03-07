CREATE TABLE IF NOT EXISTS user_infos (
    id INTEGER PRIMARY KEY,
    token TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    assignment REAL NOT NULL,
    service TEXT NOT NULL,
    interval INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS bords (
    id INTEGER PRIMARY KEY,
    plase TEXT NOT NULL,
    task_id INTEGER,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
);

INSERT INTO bords (id, plase) VALUES (1, "left");
INSERT INTO bords (id, plase) VALUES (2, "center");
INSERT INTO bords (id, plase) VALUES (3, "right");

