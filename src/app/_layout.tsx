import { initDatabase } from '@/db/DBManager';
import { SpaceGrotesk_400Regular, SpaceGrotesk_700Bold, useFonts } from '@expo-google-fonts/space-grotesk';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {

    console.log("App running...")
    const [fontsLoaded] = useFonts({
        SpaceGrotesk_400Regular,
        SpaceGrotesk_700Bold,
    });


    useEffect(() => {
        initDatabase().then(() => {
            console.log('DB is ready');
        }).catch(console.error);
    }, []);

    return <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name='(tabs-music)' />
        </Stack>;
}