import { getDb } from "./DBManager";

export interface SongPlaylist {
    song_id:number
    playlist_id:number
}

export async function getAllSongsPlaylists() {
    const db = await getDb();
    const rows = await db.getAllAsync<SongPlaylist>('SELECT * FROM songs_playlists');
    const songsPlaylists: SongPlaylist[] = rows.map(row => ({
        song_id:row.song_id,
        playlist_id:row.playlist_id
    }));
    return songsPlaylists;
}

export async function getPlaylistsBySongId(song_id:number) {
    const db = await getDb();
    const rows = await db.getAllAsync<{ playlist_id: number }>(`SELECT playlist_id FROM songs_playlists WHERE song_id = ?`, [song_id]);
    return rows.map(row => row.playlist_id);
}

export async function getPlaylistCountById(playlist_id:number) {
    const db = await getDb();
    const row = await db.getFirstAsync< {count: number} >(`SELECT COUNT(DISTINCT song_id) AS count FROM songs_playlists WHERE playlist_id = ?`, [playlist_id]);
    if (!row) return 0; else return row 
}

export async function getSongsByPlaylistId(playlist_id:number) {
    const db = await getDb();
    const rows = await db.getAllAsync<{ song_id: number }>(`SELECT song_id FROM songs_playlists WHERE playlist_id = ?`, [playlist_id]);
    return rows.map(row => row.song_id);
}

export async function addSongPlaylist(song_playlist:SongPlaylist) {
    const db = await getDb();
    try {
        await db.runAsync(`INSERT INTO songs_playlists (song_id, playlist_id) VALUES (?, ?)`, [song_playlist.song_id, song_playlist.playlist_id])
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deletePlaylistsBySongId(song_playlist:SongPlaylist) {
    const db = await getDb();
    try {
        await db.runAsync(`DELETE FROM songs_playlists WHERE song_id = ?`, [song_playlist.song_id])
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteSongsByPlaylistId(song_playlist:SongPlaylist) {
    const db = await getDb();
    try {
        await db.runAsync(`DELETE FROM songs_playlists WHERE song_id = ?`, song_playlist.playlist_id)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}