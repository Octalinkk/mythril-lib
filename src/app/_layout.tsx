import { initDatabase } from '@/db/DBManager';
import { Stack } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {

    console.log("App running...")

    useEffect(() => {
        initDatabase().then(() => {
            console.log('✅ DB prête');
        }).catch(console.error);
    }, []);

    return <Stack screenOptions={{ headerShown: false }} />;
}