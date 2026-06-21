import { getDb } from "./DBManager"

export interface Playlist {
    id:number | null
    name: string | null
    cover:string | null
    last_time_played:string | null
    time_listened: number | null
    time_started: number | null
}

export async function getAllPlaylists() {
    const db = await getDb();
    const rows = await db.getAllAsync<Playlist>('SELECT * FROM playlists');
    const playlists: Playlist[] = rows.map(row => ({
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played: row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started
    }));
    return playlists;
}

export async function getPlaylistById(id:number) {
    let playlist:Playlist
    const db = await getDb();
    const row = await db.getFirstAsync<Playlist>(`SELECT * FROM playlists WHERE id = ?`, [id]);
    if (!row) return null; else playlist = {
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played:row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started
    }
}

export async function addPlaylist(playlist:Playlist) {
    const db = await getDb();
    try {
        await db.runAsync(`INSERT INTO playlists (name, cover, last_time_played, time_listened, time_started) VALUES (?, ?, ?, ?, ?)`, 
        [playlist.name, playlist.cover, playlist.last_time_played, playlist.time_listened, playlist.time_started])
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function updatePlaylist(playlist:Playlist) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`UPDATE playlists SET name = ?, cover = ?, last_time_played = ?, time_listened = ?, time_started = ? WHERE id = ?`,
        [playlist.name, playlist.cover, playlist.last_time_played, playlist.time_listened, playlist.time_started, playlist.id]
    )
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deletePlaylist(playlist:Playlist) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`DELETE FROM playlists WHERE id = ?`, [playlist.id])
    }
    catch (err) {
        console.error(err)
        throw err
    }
}