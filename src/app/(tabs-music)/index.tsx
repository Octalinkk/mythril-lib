
import Header from '@/components/Header';
import PlaylistItem from '@/components/PlaylistItem';
import SongItem from '@/components/SongItem';
import { Artist } from '@/db/ArtistsManager';

import { getMostRecentPlst, Playlist } from '@/db/PlaylistsManager';
import { getMostRecentSongs, Song } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';
import TrackPlayer, { PlayerCommand } from "@rntp/player";
import { LinearGradient } from 'expo-linear-gradient';
import { Suspense, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

function getRecentSong(songs:Song[]){
  let recentSong = []
  if (songs.length > 0){
    for (const item of songs) {
        recentSong.push(<SongItem song_id={item.id} key={"song:"+item.id}/>)
    }
  }
  else {
    recentSong.push(<Text style={styles.filler_text} key={"song:None"}>No Songs found</Text>)
  }
  return recentSong
}

function getRecentPlaylists(playlists:Playlist[]){
  let recentPlst = []
  if (playlists.length > 0){
    for (const item of playlists) {
        recentPlst.push(<PlaylistItem playlist_id={item.id} key={"playlist:"+item.id}/>)
    }
  }
  else {
    recentPlst.push(<Text style={styles.filler_text}  key={"playlist:None"}>No Playlists found</Text>)
  }
  return recentPlst
}

function getRecentArtists(artists:Artist[]){
  let recentArtist = []

  if (artists.length > 0){
    for (const item of artists) {
        recentArtist.push(<PlaylistItem playlist_id={item.id} key={"artist:"+item.id}/>)
    }
  }
  else {
    recentArtist.push(<Text style={styles.filler_text}  key={"artist:None"}>No Artists found</Text>)
  }
  return recentArtist
}

export default function HomeScreen() {

  const [recSongs, setSong] = useState<Song[]>([]);
  const [recPlaylists, setPlaylist] = useState<Playlist[]>([]);
  const [recArtists, setArtist] = useState<Artist[]>([]);

    

  useEffect(() => {
      getMostRecentSongs().then(result => {
          if (result) setSong(result);
      });
  }, []);

  useEffect(() => {
      getMostRecentPlst().then(result => {
          if (result) setPlaylist(result);
      });
  }, []);

  useEffect(() => {
    try{
      TrackPlayer.setupPlayer({
          contentType: 'music',
          android: {
            wakeMode: 'local',
            skipSilenceEnabled: true,
            taskRemovedBehavior : 'continue',
            notification: {
              channelId: 'com.solizardstudio.mythrillib',
              channelName: 'Mythril Library',
              smallIcon: 'ic_notification',
            },
          },
      });
      TrackPlayer.setCommands({
        capabilities: [
            PlayerCommand.PlayPause,
            PlayerCommand.Next,
            PlayerCommand.SkipForward
        ],
      });
    }
    catch {}
  }, []);
  

  return (
    <LinearGradient 
      style={globalStyles.main_container}
      colors={[colors.grad_prim, colors.grad_sec, colors.grad_tri]}
      start={{x:0, y:0}}
      end={{x:1, y:1}}
    >
      <Header />

      <ScrollView style={styles.main_scroll}>
        <Text style={styles.title}>Recent Songs</Text>
        <ScrollView horizontal={true}>
          <View  style={styles.items_container_sm}>
            <Suspense fallback={<Text>Loading...</Text>}>
              {getRecentSong(recSongs)}
            </Suspense>
          </View>
        </ScrollView>
        
        
        <Text style={styles.title}>Recent Playlists</Text>
        <View  style={styles.items_container_md}>
          <Suspense fallback={<Text>Loading...</Text>}>
            {getRecentPlaylists(recPlaylists)}
          </Suspense>
        </View>

        <Text style={styles.title}>Recent Artists</Text>
        <View  style={styles.items_container_md}>
          <Suspense fallback={<Text>Loading...</Text>}>
            {getRecentArtists(recArtists)}
          </Suspense>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  title: {
    flex: 1,
    fontSize: 30,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: colors.primary
  },
  main_scroll: {
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  items_container_sm: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 20, 
    justifyContent: 'space-between', 
    gap: 10
  },
  items_container_md: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 30, 
    justifyContent: 'space-between', 
    gap: 20,
  },
  filler_text: {
    flex: 1,
    color: colors.secondary,
    fontFamily: 'SpaceGrotesk_400Regular',
  }
});
