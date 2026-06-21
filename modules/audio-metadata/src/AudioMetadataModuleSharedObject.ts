import { SharedObject, useReleasingSharedObject } from 'expo-modules-core';

import AudioMetadataModule from './AudioMetadataModule';

export declare class AudioMetadataModuleSharedObject extends SharedObject {
  count: number;
}

/**
 * Creates a new AudioMetadataModuleSharedObject instance.
 * You are responsible for releasing it from memory by calling `release()` when done.
 */
export function createAudioMetadataModuleSharedObject(): AudioMetadataModuleSharedObject {
  return new AudioMetadataModule.AudioMetadataModuleSharedObject();
}

/**
 * A hook that creates a AudioMetadataModuleSharedObject instance and automatically
 * releases it when the component unmounts.
 */
export function useAudioMetadataModuleSharedObject(): AudioMetadataModuleSharedObject {
  return useReleasingSharedObject(() => new AudioMetadataModule.AudioMetadataModuleSharedObject(), []);
}
