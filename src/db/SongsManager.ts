import { getDb } from "./DBManager"

export interface Song {
    id:number
    name: string
    file_path:string
    cover:string
    last_time_played:string
    time_listened: number
    time_started: number
}

export async function getAllSongs() {
    const db = await getDb();
    const rows = await db.getAllAsync<Song>('SELECT * FROM songs');
    const songs: Song[] = rows.map(row => ({
        id: row.id,
        name: row.name,
        file_path: row.file_path,
        cover: row.cover,
        last_time_played: row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started
    }));
    return songs;
}

export async function getMostRecentSongs() {
    const db = await getDb();
    const rows = await db.getAllAsync<Song>('SELECT * FROM songs ORDER BY last_time_played DESC LIMIT 6');
    const songs: Song[] = rows.map(row => ({
        id: row.id,
        name: row.name,
        file_path: row.file_path,
        cover: row.cover,
        last_time_played: row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started
    }));
    return songs;
}

export async function getSongById(id:number) {
    let song:Song
    const db = await getDb();
    const row = await db.getFirstAsync<Song>(`SELECT * FROM songs WHERE id = ?`, [id]);
    if (!row) return null; else return song = {
        id: row.id,
        name: row.name,
        file_path:row.file_path,
        cover: row.cover,
        last_time_played:row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started
    }
}

export async function getSongByFilePath(file_path:string) {
    let song:Song
    const db = await getDb();
    const row = await db.getFirstAsync<Song>(`SELECT * FROM songs WHERE file_path = ?`, [file_path]);
    if (!row) return null; else return song = {
        id: row.id,
        name: row.name,
        file_path:row.file_path,
        cover: row.cover,
        last_time_played:row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started
    }
}

export async function addSong(song:Song) {
    const db = await getDb();
    try {
    await db.runAsync(
    'INSERT INTO songs (name, file_path, cover, last_time_played, time_listened, time_started) VALUES (?, ?, ?, ?, ?, ?)',
    [song.name, song.file_path, song.cover, song.last_time_played, song.time_listened, song.time_started]
);
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function updateSong(song:Song) {
    const db = await getDb();
    try {
    await db.runAsync(`UPDATE songs SET name = ?, file_path = ?, cover = ?, last_time_played = ?, time_listened = ?, time_started = ? WHERE id = ?`,
        [song.name, song.file_path, song.cover, song.last_time_played, song.time_listened, song.time_started, song.id]
    )
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteSong(song:Song) {
    const db = await getDb();
    try {
        await db.runAsync(`DELETE FROM songs WHERE id = ?`, [song.id])
    }
    catch (err) {
        console.error(err)
        throw err
    }
}