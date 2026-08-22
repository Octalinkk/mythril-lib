import { NativeModule, requireNativeModule } from 'expo';

declare class AppKillerModule extends NativeModule<{}> {}

export default requireNativeModule<AppKillerModule>('AppKiller');
