import { AudioMetadataViewProps } from './AudioMetadata.types';

// AudioMetadataView is not available on the web platform.
export default function AudioMetadataView(_props: AudioMetadataViewProps) {
  throw new Error('AudioMetadataView is not available on the web platform.');
}
