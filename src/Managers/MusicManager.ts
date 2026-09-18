import TrackPlayer, { BackgroundEvent, Event } from "@rntp/player";
import { AppState } from "react-native";

export async function setupPlayerBehavior() {
    try{
      
        TrackPlayer.registerBackgroundEventHandler(() => async (event: BackgroundEvent) => {
            switch (event.type) {
                case Event.RemotePlay: await TrackPlayer.play(); break;
                case Event.RemotePause: await TrackPlayer.pause(); break;
                case Event.RemoteNext: await TrackPlayer.skipToNext(); break;
                case Event.RemotePrevious: await TrackPlayer.skipToPrevious(); break;
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
    if (curr_song.current?.id === mediaId) return // déjà à jour, rien à faire
    if (curr_song.current != null && curr_artists.current != null) {
        curr_song.current.time_listened += last_position.current
        curr_artists.current.forEach(artist => artist.time_listened += last_position.current)
        updateSong(curr_song.current)
        await Promise.all(curr_artists.current.map(artist => updateArtist(artist)))
    }
    curr_song.current = await getSongById(mediaId)
    if (curr_song.current != null) {
        curr_artists.current = await getArtistsforSongId(curr_song.current.id)
        curr_song.current.time_started += 1
        curr_song.current.last_time_played = new Date().toISOString()
        curr_artists.current.forEach(artist => {
            artist.time_started += 1
            artist.last_time_played = new Date().toISOString()
        })
        setCurrDisplaySong(curr_song.current)
        setCurrDisplayArtists(curr_artists.current)
        updateSong(curr_song.current)
        await Promise.all(curr_artists.current.map(artist => updateArtist(artist)))
    } else {
        curr_artists.current = []
    }
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

export async function setupPlayerTransition() {
    
}


