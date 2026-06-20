import { getDb } from "./DBManager";

export interface AlbumArtist {
    album_id:number
    artist_id:number
}

export async function getAllSongsAlbums() {
    const db = await getDb();
    const rows = await db.getAllAsync<AlbumArtist>('SELECT * FROM albums_artists');
    const albumsArtists: AlbumArtist[] = rows.map(row => ({
        album_id:row.album_id,
        artist_id:row.artist_id
    }));
    return albumsArtists;
}

export async function getArtistsByAlbumId(album_id:number) {
    const db = await getDb();
    const rows = await db.getAllAsync<{ artist_id: number }>(`SELECT artist_id FROM albums_artists WHERE album_id = ?`, [album_id]);
    return rows.map(row => row.artist_id);
}

export async function getAlbumsByArtistId(artist_id:number) {
    const db = await getDb();
    const rows = await db.getAllAsync<{ album_id: number }>(`SELECT album_id FROM albums_artists WHERE artist_id = ?`, [artist_id]);
    return rows.map(row => row.album_id);
}

export async function addAlbumArtist(albums_artists:AlbumArtist) {
    const db = await getDb();
    try {
        await db.runAsync(`INSERT INTO albums_artists (album_id, artist_id) VALUES (?, ?)`,
        [albums_artists.album_id, albums_artists.artist_id]
    )
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteSongsByAlbumId(albums_artists:AlbumArtist) {
    const db = await getDb();
    try {
        await db.runAsync(`DELETE FROM albums_artists WHERE album_id = ?`, [albums_artists.album_id])
    }
    catch (err) {
        console.error(err)
        throw err
    }
}

export async function deleteAlbumsBySongId(albums_artists:AlbumArtist) {
    const db = await getDb();
    try {
    const row = await db.runAsync(`DELETE FROM albums_artists WHERE artist_id = ${albums_artists.artist_id}`)
    }
    catch (err) {
        console.error(err)
        throw err
    }
}