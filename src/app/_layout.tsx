import { askAudioFilesPerms, askImagesFilesPerms } from '@/Managers/PermsManager';
import { updateSongs } from '@/Managers/StorageManager';
import { initDatabase } from '@/db/DBManager';

import { SpaceGrotesk_400Regular, SpaceGrotesk_700Bold, useFonts } from '@expo-google-fonts/space-grotesk';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {

    console.log("App launching...")
    const [fontsLoaded] = useFonts({
        SpaceGrotesk_400Regular,
        SpaceGrotesk_700Bold,
    });

    useEffect(() => {
        initDatabase().then(() => {
            console.log('Database initiated');
        }).catch(console.error);
    }, []);

    
    useEffect(() => {
        askAudioFilesPerms().then(granted => {
            console.log('Audio files permission :', granted);
            if (granted) {
            updateSongs()
        }
        })
        .catch(err => console.error('Perms error:', err));;
    }, []);

    useEffect(() => {
        askImagesFilesPerms().then(granted => {
            console.log('Images files permission :', granted);
        })
        .catch(err => console.error('Perms error:', err));;
    }, []);
    

    return <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs-music)' />
        </Stack>;
}