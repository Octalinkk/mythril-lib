import { Directory, File } from 'expo-file-system';

export default async function getMp3Files(path = "file:///storage/emulated/0/Music/") {
    const dir = new Directory(path);
    
    if (!dir.exists) {
        console.log('❌ Dossier introuvable:', path);
        return [];
    }

    const items = dir.list();
    
    // Filtre uniquement les fichiers .mp3
    return items.filter(item => 
        item instanceof File && item.name.endsWith('.mp3')
    ) as File[];
}