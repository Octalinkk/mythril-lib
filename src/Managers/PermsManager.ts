import { PermissionsAndroid, Platform } from "react-native";


export async function askAudioFilesPerms(): Promise<boolean> {
    try {
        // Android 13+ (API 33+) utilise READ_MEDIA_AUDIO
        // Android 12 et moins utilise READ_EXTERNAL_STORAGE
        const permission = Number(Platform.Version) >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(
            permission,
            {
                title: "Permission stockage",
                message: "L'app a besoin d'accéder à vos fichiers audio",
                buttonPositive: "Autoriser",
                buttonNegative: "Refuser",
            }
        );

        console.log('Permission result:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;

    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function askVideoFilesPerms(): Promise<boolean> {
    try {
        // Android 13+ (API 33+) utilise READ_MEDIA_AUDIO
        // Android 12 et moins utilise READ_EXTERNAL_STORAGE
        const permission = Number(Platform.Version) >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(
            permission,
            {
                title: "Permission stockage",
                message: "L'app a besoin d'accéder à vos fichiers audio",
                buttonPositive: "Autoriser",
                buttonNegative: "Refuser",
            }
        );

        console.log('Permission result:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;

    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function askImagesFilesPerms(): Promise<boolean> {
    try {
        // Android 13+ (API 33+) utilise READ_MEDIA_AUDIO
        // Android 12 et moins utilise READ_EXTERNAL_STORAGE
        const permission = Number(Platform.Version) >= 33
            ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
            : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(
            permission,
            {
                title: "Permission stockage",
                message: "L'app a besoin d'accéder à vos fichiers audio",
                buttonPositive: "Autoriser",
                buttonNegative: "Refuser",
            }
        );

        console.log('Permission result:', granted);
        return granted === PermissionsAndroid.RESULTS.GRANTED;

    } catch (err) {
        console.error(err);
        return false;
    }
}