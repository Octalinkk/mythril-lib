import { addArtist, Artist, getArtistByName } from '@/db/ArtistsManager';
import { addSongArtist } from '@/db/SongsArtistsManager';
import { addSong, getSongByFilePath, Song } from '@/db/SongsManager';
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

                if (metadata) {
                    if(metadata.title) {newSong.name = metadata.title}
                    if(metadata.artist) {newArtist.name = metadata.artist}
                    
                    
                }
                console.log(`Adding song : ${newSong}`)
                const lastSongId = await addSong(newSong);
                let lastArtistId = 0

                const artist = await getArtistByName(newArtist.name)
                if (!artist){
                    newArtist = {
                        id: 0,
                        name: newArtist.name,
                        cover: "",
                        last_time_played: "",
                        time_listened: 0,
                        time_started: 0
                    }
                    lastArtistId = await addArtist(newArtist)    
                }
                else {lastArtistId = artist.id} 


                await addSongArtist({
                    song_id:lastSongId,
                    artist_id:lastArtistId
                })

                
            }
        }
    };
    
    console.log("Done checking songs")
    //TODO check deletedSongs from folder still in DB?
}
