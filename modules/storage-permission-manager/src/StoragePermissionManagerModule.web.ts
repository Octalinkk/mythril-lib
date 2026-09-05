import { registerWebModule, NativeModule } from 'expo';

// StoragePermissionManagerModule is not available on the web platform.
class StoragePermissionManagerModule extends NativeModule<{}> {}

export default registerWebModule(StoragePermissionManagerModule, 'StoragePermissionManagerModule');
