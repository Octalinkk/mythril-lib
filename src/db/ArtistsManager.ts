import { getDb } from "./DBManager"

export interface Artist {
    id:number | null
    name: string | null
    cover:string | null
    last_time_played:string | null
    time_listened: number | null
    time_started: number | null
}

export async function getAllArtists() {
    const db = await getDb();
    const rows = await db.getAllAsync<Artist>('SELECT * FROM artists');
    const artists: Artist[] = rows.map(row => ({
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played: row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started
    }));
    return artists;
}

export async function getArtistById(id:number) {
    let artist:Artist
    const db = await getDb();
    const row = await db.getFirstAsync<Artist>(`SELECT * FROM artists WHERE id = ?`, [id]);
    if (!row) return null; else artist = {
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played:row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started
    }
}

export async function addArtist(artist:Artist) {
    const db = await getDb();
    try {
    await db.runAsync(`INSERT INTO artists (name, cover, last_time_played, time_listened, time_started) VALUES (?, ?, ?, ?, ?)`, 
        [artist.name, artist.cover, artist.last_time_played, artist.time_listened, artist.time_started])
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function updateArtist(artist:Artist) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`UPDATE artists SET name = ?, cover = ?, last_time_played = ?, time_listened = ?, time_started = ? WHERE id = ?`,
        [artist.name, artist.cover, artist.last_time_played, artist.time_listened, artist.time_started, artist.id]
    )
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteArtist(artist:Artist) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`DELETE FROM artists WHERE id = ?`, [artist.id])
    }
    catch (err) {
        console.error(err)
        throw err
    }
}