import { getDb } from "./DBManager"

export interface Album {
    id:Number
    name: String
    cover:String
    last_time_played:String
    time_listened: Number
    time_started: Number
}

export async function getAllAlbums() {
    const db = await getDb();
    const rows = await db.getAllAsync<Album>('SELECT * FROM albums');
    const albums: Album[] = rows.map(row => ({
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played: row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started
    }));
    return albums;
}

export async function getAlbumById(id:Number) {
    let album:Album
    const db = await getDb();
    const row = await db.getFirstAsync<Album>(`SELECT * FROM albums WHERE id = ${id}`);
    if (!row) return null; else album = {
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played:row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started
    }
}

export async function addAlbum(album:Album) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`INSERT INTO albums (name, cover, last_time_played, time_listened, time_started) 
        VALUES (${album.name}, ${album.cover}, ${album.last_time_played}, ${album.time_listened}, ${album.time_started})`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function updateAlbum(album:Album) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`UPDATE albums SET 
        name = ${album.name}, 
        cover = ${album.cover}, 
        last_time_played = ${album.last_time_played}, 
        time_listened = ${album.time_listened}, 
        time_started = ${album.time_started}
        WHERE id = ${album.id}`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteAlbum(album:Album) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`DELETE FROM albums WHERE id = ${album.id}`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}