import { requireNativeModule } from 'expo-modules-core';

const StoragePermissionManager = requireNativeModule('StoragePermissionManager');

export function hasExternalStorageAccess(): boolean {
    return StoragePermissionManager.isExternalStorageManager();
}

export function requestExternalStorageAccess(): void {
    StoragePermissionManager.requestManageExternalStorage();
}