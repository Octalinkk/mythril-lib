import { getAllSongs } from "@/db/SongsManager";
import { addSongPlaylist, getSongPlaylistById } from "@/db/SongsPlaylistsManager";

export async function checkAllSongPlaylistIntegrity(){
    const songs = await getAllSongs()
    
    await Promise.all(songs.map(async song => {
        if ( await getSongPlaylistById({song_id:song.id,playlist_id:1}) == null){
            await addSongPlaylist({song_id:song.id,playlist_id:1})
        }
    }))
}