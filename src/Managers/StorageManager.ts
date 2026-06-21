import { Song } from '@/db/SongsManager';
import { Directory, File } from 'expo-file-system';
import { getMetadata } from '../../modules/audio-metadata';

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
    const localSongs: File[] = await getMp3Files() 
    localSongs.forEach(async (song) => {
        if (song.exists && song.extension == ".mp3"){
            //TODO Je dois finir le module de lecture des meta avant
            const metadata = await getMetadata(song.uri);
            if (metadata){
                const newSong:Song = {
                    id: 0,
                    name: metadata.title,
                    file_path: song.uri,
                    cover: "",
                    last_time_played: "",
                    time_listened: 0,
                    time_started: 0
                }
            }
            else {
                const newSong:Song = {
                    id: 0,
                    name: "",
                    file_path: song.uri,
                    cover: "",
                    last_time_played: "",
                    time_listened: 0,
                    time_started: 0
                }
            }
            
        }
    });
}
