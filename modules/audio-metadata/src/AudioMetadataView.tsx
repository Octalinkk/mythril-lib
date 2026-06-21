import { requireNativeView } from 'expo';
import * as React from 'react';

import { AudioMetadataViewProps } from './AudioMetadata.types';

const NativeView: React.ComponentType<AudioMetadataViewProps> = requireNativeView('AudioMetadata');

export default function AudioMetadataView(props: AudioMetadataViewProps) {
  return <NativeView {...props} />;
}
