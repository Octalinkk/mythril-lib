package expo.modules.audiometadata

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import android.media.MediaMetadataRetriever


class AudioMetadataModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("AudioMetadata")

        AsyncFunction("getAudioMetaData") { uri: String ->
            //logique pour read
            
            val retriver = MediaMetadataRetriever()

            try {
                retriver.setDataSource(uri)
                //return existe pas mdr alors laisse comme ça
                mapOf(
                    "title" to retriver.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE), 
                    "artist" to retriver.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST), 
                    "album" to retriver.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUM), 
                    "duration" to retriver.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)
                )
                
            }
            catch(e: Exception){
                //Peut pas console.log fiat chier
                null
            }
            finally{
                retriver.release()
            }
        }
    }
}