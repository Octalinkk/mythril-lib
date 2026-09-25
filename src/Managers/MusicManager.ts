import { Album } from "@/db/AlbumsManager";
import { Artist, getArtistById, updateArtist } from "@/db/ArtistsManager";
import { Playlist } from "@/db/PlaylistsManager";
import { getArtistsBySongId } from "@/db/SongsArtistsManager";
import { getSongById, Song, updateSong } from "@/db/SongsManager";
import TrackPlayer, { BackgroundEvent, Event } from "@rntp/player";
import { AppState } from "react-native";

export interface CurrentMusicData {
    curr_song:Song|null
    curr_artists: Artist[]|null
    curr_album:Album|null
    curr_playlist:Playlist|null
}

export let currentMusicData: CurrentMusicData

export function hasCurrMusicData(){
    if(currentMusicData == null) return false
    if(currentMusicData.curr_song == null) return false
    if(currentMusicData.curr_artists == null) return false
    if(currentMusicData.curr_album == null) return false
    if(currentMusicData.curr_playlist == null) return false
    return true
}

async function getArtistsforSongId(songId:number){
    const artistsIds = await Promise.resolve(
        getArtistsBySongId(songId)
    );
    const artists = await Promise.all(
        artistsIds.map(id => getArtistById(+id))
    );
    return artists.filter((artist): artist is Artist => artist !== null);
}

let canEvent = true

export async function setupPlayerBehavior() {
    currentMusicData = {
        curr_song: null,
        curr_album: null,
        curr_artists: null,
        curr_playlist: null
    }
    try{
        TrackPlayer.addEventListener(Event.MediaItemTransition, async ({ item }) => {
            if (canEvent){
                canEvent = false
                await applyTransition(Number(item?.mediaId)) 
            }
                       
        })
        TrackPlayer.registerBackgroundEventHandler(() => async (event: BackgroundEvent) => {
            switch (event.type) {
                case Event.RemotePlay: await TrackPlayer.play(); break;
                case Event.RemotePause: await TrackPlayer.pause(); break;
                case Event.RemoteNext: await TrackPlayer.skipToNext(); break;
                case Event.RemotePrevious: await TrackPlayer.skipToPrevious(); break;
                case Event.MediaItemTransition: await applyTransition(Number(event.item?.mediaId)); break;
            }
        });
        TrackPlayer.setupPlayer({
            contentType: 'music',
            android: {
                wakeMode: 'local',
                taskRemovedBehavior : 'continue',
                notification: {
                channelId: 'com.solizardstudio.mythrillib',
                channelName: 'Mythril Library',
                smallIcon: 'ic_notification',
                },
            },
        });
    }
    catch {}
}

export async function applyTransition(mediaId: number) {
    if (mediaId === undefined) return
    if (currentMusicData.curr_song != null && currentMusicData.curr_song.id === mediaId) return // déjà à jour, rien à faire
    if (currentMusicData.curr_song != null && currentMusicData.curr_artists != null) {

        currentMusicData.curr_song.time_listened += TrackPlayer.getProgress().position
        currentMusicData.curr_artists.forEach(artist => artist.time_listened += TrackPlayer.getProgress().position)
        await updateSong(currentMusicData.curr_song)
        await Promise.all(currentMusicData.curr_artists.map(artist => updateArtist(artist)))
    }
    currentMusicData.curr_song = await getSongById(mediaId)
    if (currentMusicData.curr_song != null) {
        
        currentMusicData.curr_artists = await getArtistsforSongId(currentMusicData.curr_song.id)
        currentMusicData.curr_song.time_started += 1
        currentMusicData.curr_song.last_time_played = new Date().toISOString()
        currentMusicData.curr_artists.forEach(artist => {
            artist.time_started += 1
            artist.last_time_played = new Date().toISOString()
        })
        await updateSong(currentMusicData.curr_song)
        await Promise.all(currentMusicData.curr_artists.map(artist => updateArtist(artist)))
    } else {
        currentMusicData.curr_artists = []
    }
    canEvent = true
}

export async function updateInfoOnOpen() {
    const sub = AppState.addEventListener('change', (nextState) => {
         if (nextState === 'active') {
             const activeItem = TrackPlayer.getActiveMediaItem()
             if (activeItem?.mediaId !== undefined) {
                 applyTransition(Number(activeItem.mediaId))
             }
         }
     });
     return () => sub.remove();
}



