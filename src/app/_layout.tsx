import { askAudioFilesPerms } from '@/Managers/PermsManager';
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
        //1. Init DB
        initDatabase().then(() => {
            console.log('Database initiated');
            //2. Ask perms to read files
            askAudioFilesPerms().then(granted => {
                console.log('Audio files permission :', granted);
                if (granted) {
                    // 3.update DB
                    updateSongs()
                }
            })
        .catch(err => console.error('Perms error:', err));
        }).catch(console.error);
    }, []);

    

    return (
    <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs-music)' />
    </Stack>
    )
}