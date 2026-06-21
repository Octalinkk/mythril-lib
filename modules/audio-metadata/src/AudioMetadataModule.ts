import { NativeModule, requireNativeModule } from 'expo';
import { AudioMetadataModuleEvents, SongMetadata } from './AudioMetadata.types';


declare class AudioMetadataModule extends NativeModule<AudioMetadataModuleEvents> {
  getAudioMetaData: (uri: string) => SongMetadata //change le type pour mon custom
}

export default requireNativeModule<AudioMetadataModule>('AudioMetadata');
