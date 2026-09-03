import { addAlbum, Album, getAlbumByName } from '@/db/AlbumsManager';
import { addAlbumArtist, getAlbumArtistById } from '@/db/ArtistsAlbumsManager';
import { addArtist, Artist, getArtistByName } from '@/db/ArtistsManager';
import { getLastPlaylistId } from '@/db/DBManager';
import { addPlaylist, getPlaylistById, setReservedPlaylistLimit } from '@/db/PlaylistsManager';
import { addSongAlbum } from '@/db/SongsAlbumsManager';
import { addSongArtist } from '@/db/SongsArtistsManager';
import { addSong, getSongByFilePath, Song } from '@/db/SongsManager';
import { addSongPlaylist, getSongPlaylistById, SongPlaylist } from '@/db/SongsPlaylistsManager';
import { Directory, File, Paths } from 'expo-file-system';
import * as FS from 'react-native-fs';
import { getAudioMetaData } from '../../modules/audio-metadata';
import { meta } from './AppInfo';

interface SerializedFile {
    path: string;      // chemin relatif dans l'app
    content: string;   // contenu en Base64
}

async function serializeDirectory(dir: Directory, basePath: string = ''): Promise<SerializedFile[]> {
    const items = dir.list();
    let files: SerializedFile[] = [];

    for (const item of items) {
        const relativePath = basePath ? `${basePath}/${item.name}` : item.name;

        if (item instanceof File) {
            const content = item.base64Sync(); // ← lit et encode en Base64
            files.push({ path: relativePath, content });
        } else if (item instanceof Directory) {
            const subFiles = await serializeDirectory(item, relativePath);
            files = files.concat(subFiles);
        }
    }

    return files;
}

export async function exportDatas() {

    

    const files = await serializeDirectory(new Directory("file://"+FS.ExternalDirectoryPath+"Documents/MythrilLibData.json"))
    
    const backup = {
        version: meta.version,
        date: new Date().toISOString(),
        files: files
    };

    console.log(FS.DownloadDirectoryPath)
    const backupFile = new File("file://"+FS.DownloadDirectoryPath+"/MythrilLibData.json");
    console.log(backupFile.uri)
    if (backupFile.exists) backupFile.delete();
    await FS.writeFile("file://"+FS.DownloadDirectoryPath+"/MythrilLibData.json", JSON.stringify(backup), "utf8")
    
    console.log(`Export terminé — ${files.length} fichiers`);
}

export async function importDatas() {
    //await deleteAllDatas()
    const backupFile = new File("file://"+FS.DownloadDirectoryPath+"/MythrilLibData.json");
    
    if (!backupFile.exists) {
        console.log('Aucune sauvegarde trouvée');
        return;
    }

    const raw = await backupFile.text();
    const backup = JSON.parse(raw);

    for (const fileEntry of backup.files) {
        const targetFile = new File(Paths.document, fileEntry.path);
        
        // Crée le dossier parent si besoin
        const parentDir = new Directory(targetFile.uri.substring(0, targetFile.uri.lastIndexOf('/')));
        if (!parentDir.exists) {
            parentDir.create();
        }

        // Décode et écrit
        const bytes = base64ToBytes(fileEntry.content);
        targetFile.write(bytes);
    }

    console.log(`Import terminé — ${backup.files.length} fichiers restaurés`);
}

function base64ToBytes(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export async function deleteAllDatas() {
        if (new Directory(Paths.document, 'songCover').exists){
            new Directory(Paths.document, 'songCover').delete()
        }if (new Directory(Paths.document, 'artistProfil').exists){
            new Directory(Paths.document, 'artistProfil').delete()
        }if (new Directory(Paths.document, 'albumCover').exists){
            new Directory(Paths.document, 'albumCover').delete()
        }if (new Directory(Paths.document, 'playlistCover').exists){
            new Directory(Paths.document, 'playlistCover').delete()
        }if (new Directory(Paths.document, 'SQLite').exists){
            new Directory(Paths.document, 'SQLite').delete()
    }
}

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
            }
        }
    };
    
    console.log("Done checking songs")
}
