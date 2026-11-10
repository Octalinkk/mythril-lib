import { updateSongCreationDate } from '@/Managers/StorageManager';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { getAllSongs } from './SongsManager';

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
    updateDBToLatest()
    console.log('DB builded');
}

export async function updateDBToLatest() {
    console.log("DB has some change") 
    await updateAddCreationDate()
}

export async function updateAddCreationDate() {
    
    const db = await getDb();
    try{
        await db.execAsync(`
            ALTER TABLE songs
            ADD COLUMN time_created TEXT DEFAULT "";
        `);        
    }
    catch{
        console.warn("Cant add 'time_created' to songs. It already exists ?")
    }
    const songs = await (await getAllSongs()).filter((song) => song.time_created == "")
    if (songs.length > 0)
    {
        for (const song of songs) {
        await updateSongCreationDate(song)
    }
}
}

export async function getLastPlaylistId(){
    const db = await getDb();
    const row = await db.getFirstAsync<{ seq: number }>(`SELECT seq FROM sqlite_sequence WHERE name = 'playlists'`)
    if (!row) return null 
    return row.seq
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
            time_started INTEGER DEFAULT 0,
            time_created TEXT DEFAULT ""
        );
    `);
}

async function createArtistsTable(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS artists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
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
            name TEXT NOT NULL UNIQUE,
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
            name TEXT NOT NULL UNIQUE,
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

