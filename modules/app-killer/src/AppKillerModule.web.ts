import { registerWebModule, NativeModule } from 'expo';

class AppKillerModule extends NativeModule<{}> {}

export default registerWebModule(AppKillerModule, 'AppKillerModule');
