package expo.modules.audiometadata

import android.media.MediaMetadataRetriever
import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class AudioMetadataModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("AudioMetadata")

        AsyncFunction("getMetadata") { uri: String ->
            val retriever = MediaMetadataRetriever()
            
            try {
                // Convertit content:// et file:// correctement
                if (uri.startsWith("content://")) {
                    retriever.setDataSource(appContext.reactContext, android.net.Uri.parse(uri))
                } else {
                    retriever.setDataSource(uri)
                }

                mapOf(
                    "title"    to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE),
                    "artist"   to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST),
                    "album"    to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUM),
                    "duration" to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION),
                    "genre"    to retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_GENRE)
                )
            } catch (e: Exception) {
                // Retourne null pour tous les champs au lieu de crasher
                mapOf(
                    "title"    to null,
                    "artist"   to null,
                    "album"    to null,
                    "duration" to null,
                    "genre"    to null
                )
            } finally {
                retriever.release()
            }
        }
    }
}