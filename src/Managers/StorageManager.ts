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
    console.log("updating db..")
    const localSongs: File[] = await getMp3Files() 
    //Check if a song isn't saved in the DB
    for (const song of localSongs) {
        if (song.exists && song.extension == ".mp3"){
            if(!await getSongByFilePath(song.uri)) {
                console.log("Song not in DB")
                const metadata = await getAudioMetaData(song.uri);
                let newSong: Song = {
                    id: 0,
                    name: "",
                    file_path: song.uri,
                    cover: "@/res/def_cover.png",
                    last_time_played: "",
                    time_listened: 0,
                    time_started: 0
                };

                if (metadata && metadata.title) {
                    newSong.name = metadata.title;
                }
                await addSong(newSong);
            }
        }
    };

    //TODO check deletedSongs from folder still in DB?
}
