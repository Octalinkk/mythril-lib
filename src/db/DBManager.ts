import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';

let dbPromise: Promise<SQLiteDatabase> | null = null;

export function getDb(): Promise<SQLiteDatabase> {
    if (!dbPromise) {
        dbPromise = openDatabaseAsync('data.db');
    }
    return dbPromise;
}

export async function initDatabase(): Promise<void> {
    const db = await getDb();
    await createSongsTable(db)
    await createArtistsTable(db)
    await createAlbumsTable(db)
    await createPlaylistsTable(db)
    await createSongsArtistsTable(db)
    await createSongsAlbumsTable(db)
    await createAlbumsArtistsTable(db)
    await createSongsPlaylistsTable(db)

    console.log('DB builded');
}
async function createSongsTable(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            cover TEXT,
            last_time_played TEXT,
            time_listened INTEGER DEFAULT 0,
            time_started INTEGER DEFAULT 0
        );
    `);
}

async function createArtistsTable(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS artists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cover TEXT,
            last_time_played TEXT,
            time_listened INTEGER DEFAULT 0,
            time_started INTEGER DEFAULT 0
        );
    `);
}

async function createAlbumsTable(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS albums (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cover TEXT,
            last_time_played TEXT,
            time_listened INTEGER DEFAULT 0,
            time_started INTEGER DEFAULT 0
        );
    `);
}

async function createPlaylistsTable(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cover TEXT,
            last_time_played TEXT,
            time_listened INTEGER DEFAULT 0,
            time_started INTEGER
        );
    `);
}

async function createSongsArtistsTable(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS songs_artists (
            song_id INTEGER NOT NULL,
            artist_id INTEGER NOT NULL,
            PRIMARY KEY (song_id, artist_id)
        );
    `);
}

async function createSongsAlbumsTable(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS songs_albums (
            song_id INTEGER NOT NULL,
            album_id INTEGER NOT NULL,
            PRIMARY KEY (song_id, album_id)
        );
    `);
}

async function createAlbumsArtistsTable(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS albums_artists (
            album_id INTEGER NOT NULL,
            artist_id INTEGER NOT NULL,
            PRIMARY KEY (album_id, artist_id)
        );
    `);
}

async function createSongsPlaylistsTable(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS songs_playlists (
            song_id INTEGER NOT NULL,
            playlist_id INTEGER NOT NULL,
            PRIMARY KEY (song_id, playlist_id)
        );
    `);
}