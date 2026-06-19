import { getDb } from "./DBManager";

export interface SongArtist {
    song_id:Number
    artist_id:Number
}

export async function getAllSongsArtists() {
    const db = await getDb();
    const rows = await db.getAllAsync<SongArtist>('SELECT * FROM songs_artists');
    const songsArtists: SongArtist[] = rows.map(row => ({
        song_id:row.song_id,
        artist_id:row.artist_id
    }));
    return songsArtists;
}

export async function getSongsByArtistId(artist_id:Number) {
    const db = await getDb();
    const rows = await db.getAllAsync<{ song_id: number }>(`SELECT song_id FROM songs_artists WHERE artist_id = ${artist_id}`);
    return rows.map(row => row.song_id);
}

export async function getArtistsBySongId(song_id:Number) {
    const db = await getDb();
    const rows = await db.getAllAsync<{ artist_id: number }>(`SELECT artist_id FROM songs_artists WHERE song_id = ${song_id}`);
    return rows.map(row => row.artist_id);
}

export async function addSongArtist(song_artist:SongArtist) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`INSERT INTO songs_artists (song_id, artist_id) 
        VALUES (${song_artist.song_id}, ${song_artist.artist_id})`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteSongsByArtistId(song_artist:SongArtist) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`DELETE FROM songs_artists WHERE artist_id = ${song_artist.artist_id}`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteArtistsBySongId(song_artist:SongArtist) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`DELETE FROM songs_artists WHERE song_id = ${song_artist.song_id}`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}