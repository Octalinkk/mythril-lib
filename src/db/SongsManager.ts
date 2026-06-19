import { getDb } from "./DBManager"

export interface Song {
    id:Number
    name: String
    file_path:String
    cover:String
    last_time_played:String
    time_listened: Number
    time_started: Number
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

export async function getSongById(id:Number) {
    let song:Song
    const db = await getDb();
    const row = await db.getFirstAsync<Song>(`SELECT * FROM songs WHERE id = ${id}`);
    if (!row) return null; else song = {
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
    const row = await db.runAsync(`INSERT INTO songs (name, file_path, cover, last_time_played, time_listened, time_started) 
        VALUES (${song.name}, ${song.file_path}, ${song.cover}, ${song.last_time_played}, ${song.time_listened}, ${song.time_started})`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function updateSong(song:Song) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`UPDATE songs SET 
        name = ${song.name}, 
        file_path = ${song.file_path}, 
        cover = ${song.cover}, 
        last_time_played = ${song.last_time_played}, 
        time_listened = ${song.time_listened}, 
        time_started = ${song.time_started}
        WHERE id = ${song.id}`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteSong(song:Song) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`DELETE FROM songs WHERE id = ${song.id}`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}