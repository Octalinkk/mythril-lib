import { getDb } from "./DBManager";

export interface SongAlbum {
    song_id:Number
    album_id:Number
}

export async function getAllSongsAlbums() {
    const db = await getDb();
    const rows = await db.getAllAsync<SongAlbum>('SELECT * FROM songs_albums');
    const songsAlbums: SongAlbum[] = rows.map(row => ({
        song_id:row.song_id,
        album_id:row.album_id
    }));
    return songsAlbums;
}

export async function getSongsByAlbumId(album_id:Number) {
    const db = await getDb();
    const rows = await db.getAllAsync<{ song_id: number }>(`SELECT song_id FROM songs_albums WHERE album_id = ${album_id}`);
    return rows.map(row => row.song_id);
}

export async function getAlbumsBySongId(song_id:Number) {
    const db = await getDb();
    const rows = await db.getAllAsync<{ album_id: number }>(`SELECT album_id FROM songs_albums WHERE song_id = ${song_id}`);
    return rows.map(row => row.album_id);
}

export async function addSongAlbum(songs_albums:SongAlbum) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`INSERT INTO songs_albums (song_id, album_id) 
        VALUES (${songs_albums.song_id}, ${songs_albums.album_id})`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteSongsByAlbumId(songs_albums:SongAlbum) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`DELETE FROM songs_albums WHERE album_id = ${songs_albums.album_id}`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteAlbumsBySongId(songs_albums:SongAlbum) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`DELETE FROM songs_albums WHERE song_id = ${songs_albums.song_id}`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}