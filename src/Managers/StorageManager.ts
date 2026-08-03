import { addAlbum, Album, getAlbumByName } from '@/db/AlbumsManager';
import { addAlbumArtist, getAlbumArtistById } from '@/db/ArtistsAlbumsManager';
import { addArtist, Artist, getArtistByName } from '@/db/ArtistsManager';
import { getLastPlaylistId } from '@/db/DBManager';
import { addPlaylist, getPlaylistById, setReservedPlaylistLimit } from '@/db/PlaylistsManager';
import { addSongAlbum } from '@/db/SongsAlbumsManager';
import { addSongArtist } from '@/db/SongsArtistsManager';
import { addSong, getSongByFilePath, Song } from '@/db/SongsManager';
import { addSongPlaylist, getSongPlaylistById, SongPlaylist } from '@/db/SongsPlaylistsManager';
import { Directory, File } from 'expo-file-system';
import { getAudioMetaData } from '../../modules/audio-metadata';

export default async function getMp3Files(path = "file:///storage/emulated/0/Music/"): Promise<File[]> {
    const dir = new Directory(path);
    
    if (!dir.exists) {
        console.log('Dossier introuvable:', path);
        return [];
    }

    const items = dir.list();
    return items.filter(item => 
        item instanceof File && item.name.endsWith('.mp3')
    ) as File[];
}

export async function updateSongs() {
    console.log("Checking for missing songs..")
    const localSongs: File[] = await getMp3Files() 
    //Check if a song isn't saved in the DB
    let firstPlaylistId
    const allSongsPlaylist = await getPlaylistById(1)
    if (allSongsPlaylist == null){
        await addPlaylist({
            id:1,
            cover: "",
            name: "All songs",
            last_time_played: new Date().toISOString(),
            time_listened: 0,
            time_started: 0
        })
        firstPlaylistId = await getLastPlaylistId()
    }
    else {
        firstPlaylistId = allSongsPlaylist.id
    }
    
    setReservedPlaylistLimit(1)

    for (const song of localSongs) {
        if (song.exists && song.extension == ".mp3"){
            if(!await getSongByFilePath(song.uri)) {
                const metadata = await getAudioMetaData(song.uri);
                let newSong: Song = {
                    id: 0,
                    name: "",
                    file_path: song.uri,
                    cover: "",
                    last_time_played: new Date().toISOString(),
                    time_listened: 0,
                    time_started: 0
                }
                let newArtist: Artist = {
                    id: 0,
                    name: "",
                    cover: "",
                    last_time_played: new Date().toISOString(),
                    time_listened: 0,
                    time_started: 0
                }
                let newAlbum: Album = {
                    id: 0,
                    name: "",
                    cover: "",
                    last_time_played: new Date().toISOString(),
                    time_listened: 0,
                    time_started: 0
                }

                if (metadata) {
                    if(metadata.title && metadata.title.replaceAll(" ", "").replaceAll("\n", "") != "") {newSong.name = metadata.title} else {newSong.name = song.name.replace(".mp3", "")}
                    if(metadata.artist && metadata.artist.replaceAll(" ", "").replaceAll("\n", "") != "") {newArtist.name = metadata.artist}
                    if(metadata.album && metadata.album.replaceAll(" ", "").replaceAll("\n", "") != "") {newAlbum.name = metadata.album}
                }
                console.log(`Adding song : ${newSong.name}`)
                const lastSongId = await addSong(newSong);
                let lastArtistId = 0
                let lastAlbumId = 0
                let artist = null 
                let album = null

                if (newArtist.name != ""){
                    artist = await getArtistByName(newArtist.name)
                    if (artist == null){
                        newArtist = {
                            id: 0,
                            name: newArtist.name,
                            cover: "",
                            last_time_played: new Date().toISOString(),
                            time_listened: 0,
                            time_started: 0
                        }
                        
                        console.log(`Adding artist : ${newArtist.name}`)
                        lastArtistId = await addArtist(newArtist)    
                    }
                    else {lastArtistId = artist.id} 
                }

                if (newAlbum.name != ""){
                    album = await getAlbumByName(newAlbum.name)
                    if (album == null){
                        newAlbum = {
                            id: 0,
                            name: newAlbum.name,
                            cover: "",
                            last_time_played: new Date().toISOString(),
                            time_listened: 0,
                            time_started: 0
                        }
                        
                        console.log(`Adding album : ${newAlbum.name}`)
                        lastAlbumId = await addAlbum(newAlbum)    
                    }
                    else {lastAlbumId = album.id} 
                }

                if (lastArtistId != 0){
                    await addSongArtist({
                        song_id:lastSongId,
                        artist_id:lastArtistId
                    })
                }
                if (lastAlbumId != 0){
                    await addSongAlbum({
                        song_id:lastSongId,
                        album_id:lastAlbumId
                    })    
                }
                if (lastAlbumId != 0 && lastArtistId != 0) {
                    const newAlbArt = {
                        album_id:lastAlbumId,
                        artist_id:lastArtistId
                    }
                    const has_already = await getAlbumArtistById(newAlbArt)
                    if(has_already == null){
                        await addAlbumArtist(newAlbArt)
                    }       
                }
                if (firstPlaylistId != null){
                    const newSongPlst:SongPlaylist = {
                        song_id:lastSongId,
                        playlist_id:firstPlaylistId
                    }
                    const songInAllPlst = await getSongPlaylistById(newSongPlst)
                    console.warn(songInAllPlst)
                    if(songInAllPlst == null){
                        await addSongPlaylist(newSongPlst)
                    }
                }
                else {
                    console.log("skip")
                }
            }
        }
    };
    
    console.log("Done checking songs")
}
