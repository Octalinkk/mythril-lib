import { SQLiteDatabase } from 'expo-sqlite';

// Appelée une seule fois au démarrage par SQLiteProvider
export async function initDatabase(db: SQLiteDatabase): Promise<void> {
    await db.execAsync(`
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            cover TEXT,
            last_time_played TEXT,
            time_listened INTEGER DEFAULT 0,
            time_started INTEGER
        );
    `);

    console.log('✅ DB initialisée');
}