import { NativeModule, requireNativeModule } from 'expo';

import { AudioMetadataModuleEvents } from './AudioMetadata.types';

declare class AudioMetadataModule extends NativeModule<AudioMetadataModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  AudioMetadataModuleSharedObject: typeof AudioMetadataModuleSharedObject;
}

export default requireNativeModule<AudioMetadataModule>('AudioMetadata');
