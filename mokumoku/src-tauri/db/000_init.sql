CREATE TABLE IF NOT EXISTS user_infos (
    id INTEGER PRIMARY KEY,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    assignment REAL NOT NULL,
    service TEXT NOT NULL,
    interval INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS tree_states (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bords (
    id INTEGER PRIMARY KEY,
    plase TEXT NOT NULL,
    task_id INTEGER,
    tree_state_id INTEGER,
    FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
    FOREIGN KEY (tree_state_id) REFERENCES tree_states (id) ON DELETE CASCADE
);

INSERT INTO tree_states (id, name) VALUES (0, "none"), (1, "seed"), (2, "sprout"), (3, "tree"), (4, "nut"), (5, "dead");
INSERT INTO bords (id, plase, tree_state_id) VALUES (1, "left", 0);
INSERT INTO bords (id, plase, tree_state_id) VALUES (2, "center", 0);
INSERT INTO bords (id, plase, tree_state_id) VALUES (3, "right", 0);
