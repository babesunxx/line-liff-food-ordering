const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database');
        createTables();
    }
});

// Create tables if they don't exist
function createTables() {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_admin BOOLEAN DEFAULT 0,
            expired_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('Users table ready');
            // Create logs table
            db.run(`
                CREATE TABLE IF NOT EXISTS logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT NOT NULL,
                    action TEXT NOT NULL,
                    provider TEXT NOT NULL,
                    table_id TEXT NOT NULL,
                    created_at DATETIME DEFAULT (datetime('now', 'localtime'))
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating logs table:', err);
                } else {
                    console.log('Logs table ready');
                    // Create a default admin user if none exists
                    createDefaultAdmin();
                }
            });
        }
    });
}

// Create default admin user
async function createDefaultAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    db.get('SELECT id FROM users WHERE username = ?', ['admin'], (err, row) => {
        if (err) {
            console.error('Error checking admin user:', err);
        } else if (!row) {
            db.run(`
                INSERT INTO users (username, password, is_admin)
                VALUES (?, ?, 1)
            `, ['admin', hashedPassword], (err) => {
                if (err) {
                    console.error('Error creating admin user:', err);
                } else {
                    console.log('Default admin user created');
                }
            });
        }
    });
}

// Verify user credentials
function verifyUser(username, password) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ? AND (expired_at IS NULL OR expired_at > datetime())',
            [username],
            async (err, user) => {
                if (err) {
                    reject(err);
                } else if (!user) {
                    resolve(null);
                } else {
                    const match = await bcrypt.compare(password, user.password);
                    resolve(match ? user : null);
                }
            }
        );
    });
}

// Create log entry
function createLog(username, action, provider, tableId) {
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO logs (username, action, provider, table_id) VALUES (?, ?, ?, ?)',
            [username, action, provider, tableId],
            (err) => {
                if (err) {
                    console.error('Error creating log:', err);
                    reject(err);
                } else {
                    resolve();
                }
            }
        );
    });
}

module.exports = {
    db,
    verifyUser,
    createLog
}; 