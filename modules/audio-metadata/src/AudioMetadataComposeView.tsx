import { requireNativeView } from 'expo';
import { type PrimitiveBaseProps } from '@expo/ui/jetpack-compose';
import { createViewModifierEventListener } from '@expo/ui/jetpack-compose/modifiers';
import * as React from 'react';

export interface AudioMetadataComposeViewProps extends PrimitiveBaseProps {
  title: string;
  children?: React.ReactNode;
}

const NativeAudioMetadataComposeView = requireNativeView<AudioMetadataComposeViewProps>(
  'AudioMetadata',
  'AudioMetadataComposeView'
);

export default function AudioMetadataComposeView({
  modifiers,
  ...rest
}: AudioMetadataComposeViewProps) {
  return (
    <NativeAudioMetadataComposeView
      modifiers={modifiers}
      {...(modifiers ? createViewModifierEventListener(modifiers) : undefined)}
      {...rest}
    />
  );
}
