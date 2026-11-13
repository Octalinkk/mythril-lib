import { getDb } from "./DBManager"

export interface Artist {
    id:number
    name: string
    cover:string
    last_time_played:string
    time_listened: number
    time_started: number
    pinned: number
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
        time_started: row.time_started,
        pinned: row.pinned
    }));
    return artists;
}

export async function getAllArtistsOrdered() {
    const db = await getDb();
    const rows = await db.getAllAsync<Artist>('SELECT * FROM artists ORDER BY name ASC');
    const artists: Artist[] = rows.map(row => ({
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played: row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started,
        pinned: row.pinned
    }));
    return artists;
}

export async function getAllArtistsPinnedOrdered() {
    const db = await getDb();
    const rows = await db.getAllAsync<Artist>('SELECT * FROM artists WHERE pinned = TRUE ORDER BY name ASC');
    const artists: Artist[] = rows.map(row => ({
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played: row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started,
        pinned: row.pinned
    }));
    return artists;
}

export async function getArtistById(id:number) {
    let artist:Artist
    const db = await getDb();
    const row = await db.getFirstAsync<Artist>(`SELECT * FROM artists WHERE id = ?`, [id]);
    if (!row) return null; else return artist = {
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played:row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started,
        pinned: row.pinned
    }
}

export async function getArtistByName(name:string) {
    let artist:Artist
    const db = await getDb();
    const row = await db.getFirstAsync<Artist>(`SELECT * FROM artists WHERE name = ?`, [name]);
    if (!row) return null; else return artist = {
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played:row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started,
        pinned: row.pinned
    }
}

export async function getMostRecentArtists() {
    const db = await getDb();
    const rows = await db.getAllAsync<Artist>('SELECT * FROM artists ORDER BY last_time_played DESC LIMIT 6');
    const artists: Artist[] = rows.map(row => ({
        id: row.id,
        name: row.name,
        cover: row.cover,
        last_time_played: row.last_time_played,
        time_listened: row.time_listened,
        time_started: row.time_started,
        pinned: row.pinned
    }));
    return artists;
}

export async function isArtistinDB(name:string) {
    let artist:Artist
    const db = await getDb();
    const row = await db.getFirstAsync<Artist>(`SELECT * FROM artists WHERE name = ?`, [name]);
    if (!row) return false; else return true
}

export async function addArtist(artist:Artist) {
    const db = await getDb();
    try {
        const result = await db.runAsync(`INSERT INTO artists (name, cover, last_time_played, time_listened, time_started, pinned) VALUES (?, ?, ?, ?, ?, ?)`, 
            [artist.name, artist.cover, artist.last_time_played, artist.time_listened, artist.time_started, artist.pinned])
        return result.lastInsertRowId 
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function updateArtist(artist:Artist) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`UPDATE artists SET name = ?, cover = ?, last_time_played = ?, time_listened = ?, time_started = ?, pinned = ? WHERE id = ?`,
        [artist.name, artist.cover, artist.last_time_played, artist.time_listened, artist.time_started, artist.pinned, artist.id]
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