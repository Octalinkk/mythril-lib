import { requireNativeModule } from 'expo-modules-core';

const AppKiller = requireNativeModule('AppKiller');

export function killApp(): void {
    AppKiller.killApp();
}