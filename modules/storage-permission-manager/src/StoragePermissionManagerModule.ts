import { NativeModule, requireNativeModule } from 'expo';

declare class StoragePermissionManagerModule extends NativeModule<{}> {}

export default requireNativeModule<StoragePermissionManagerModule>('StoragePermissionManager');
