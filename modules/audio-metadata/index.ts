import AudioMetadataModule from "./src/AudioMetadataModule";

export * from "./src/AudioMetadata.types";
export { default } from "./src/AudioMetadataModule";


export function getAudioMetaData(uri:string) {
    return AudioMetadataModule.getAudioMetaData(uri)
}
