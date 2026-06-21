import { createModifier, type ModifierConfig } from '@expo/ui/jetpack-compose/modifiers';

export const audioMetadataComposeModifier = (params: {
  color?: number;
  width?: number;
  cornerRadius?: number;
}): ModifierConfig => createModifier('audioMetadataComposeModifier', params);
