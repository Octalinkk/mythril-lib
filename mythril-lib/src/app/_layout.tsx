import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from '@/db/DBManager';
import { Suspense } from 'react';
import { ActivityIndicator } from 'react-native';

export default function RootLayout() {
    return (
        <SQLiteProvider
            databaseName="data.db"
            onInit={initDatabase}
            useSuspense
        >
            <Suspense fallback={<ActivityIndicator />}>
                <Stack screenOptions={{ headerShown: false }} />
            </Suspense>
        </SQLiteProvider>
    );
}