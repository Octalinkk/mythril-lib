package expo.modules.appkiller

import android.os.Process
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AppKillerModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("AppKiller")

        Function("killApp") {
            Process.killProcess(Process.myPid())
        }
    }
}