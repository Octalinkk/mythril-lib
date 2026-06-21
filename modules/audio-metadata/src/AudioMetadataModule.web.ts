import { registerWebModule, NativeModule } from 'expo';

import { AudioMetadataModuleEvents } from './AudioMetadata.types';

// AudioMetadataModule is not available on the web platform.
class AudioMetadataModule extends NativeModule<AudioMetadataModuleEvents> {}

export default registerWebModule(AudioMetadataModule, 'AudioMetadataModule');
