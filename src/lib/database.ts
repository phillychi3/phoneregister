import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';
import fs from 'fs';

let dbPath: string;

if (typeof window !== 'undefined') {

    throw new Error('Database cannot be initialized in browser environment');
} else {

    if (process.env.NODE_ENV === 'production') {

        const userHome = os.homedir();
        const appDataDir = path.join(userHome, '.phoneregister');


        try {
            fs.mkdirSync(appDataDir, { recursive: true });
        } catch (error) {
            console.warn('Failed to create app data directory:', error);
        }

        dbPath = path.join(appDataDir, 'phones.db');
    } else {

        dbPath = 'phones.db';
    }
}

const db = new Database(dbPath);


db.exec(`
  CREATE TABLE IF NOT EXISTS phones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    number TEXT UNIQUE NOT NULL
  )
`);

console.log(`Database initialized at: ${dbPath}`);

export default db;