import { requireNativeModule } from 'expo-modules-core';

const AudioMetadata = requireNativeModule('AudioMetadata');

export interface SongMetadata {
    title: string | null;
    artist: string | null;
    album: string | null;
    duration: string | null;
    genre: string | null;
    cover: string | null;  // ← Base64 data URL
}

export async function getMetadata(uri: string): Promise<SongMetadata | null> {
    try {
        return await AudioMetadata.getMetadata(uri);
    } catch (err) {
        console.warn(`⚠️ Métadonnées inaccessibles pour : ${uri}`);
        return null;
    }
}