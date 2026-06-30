
import Header from '@/components/Header';
import PlaylistItem from '@/components/PlaylistItem';
import SongItem from '@/components/SongItem';

import { getMostRecentPlst, Playlist } from '@/db/PlaylistsManager';
import { getMostRecentSongs, Song } from '@/db/SongsManager';
import { SongPlaylist } from '@/db/SongsPlaylistsManager';
import { colors, globalStyles } from '@/styles/global';
import TrackPlayer, { PlayerCommand } from "@rntp/player";
import { LinearGradient } from 'expo-linear-gradient';
import { Suspense, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {

  const [recSongs, setSong] = useState<Song[]>([]);
  const [recPlaylists, setPlaylist] = useState<Playlist[]>([]);

  let wasd: Playlist = {
    id: 0,
    name: "Test",
    cover:"",
    last_time_played:"" ,
    time_listened: 0,
    time_started: 0
}

let daa: SongPlaylist = {
    song_id:1,
    playlist_id:1
}
    
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
      TrackPlayer.setupPlayer({
          contentType: 'music',
      });
      TrackPlayer.setCommands({
        capabilities: [
            PlayerCommand.PlayPause,
            PlayerCommand.Next,
            PlayerCommand.Previous,
        ],
      });
  }, []);

  
      

  let recentSong = []
  if (recSongs.length > 0){
    for (const item of recSongs) {
        recentSong.push(<SongItem song_id={item.id} key={"song:"+item.id}/>)
    }
  }

  let recentPlst = []
  if (recPlaylists.length > 0){
    for (const item of recPlaylists) {
        recentPlst.push(<PlaylistItem playlist_id={item.id} key={"playlist:"+item.id}/>)
    }
  }
  
  
  

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
              {recentSong}
            </Suspense>
          </View>
        </ScrollView>
        
        
        <Text style={styles.title}>Recent Playlists</Text>
        <View  style={styles.items_container_md}>
          <Suspense fallback={<Text>Loading...</Text>}>
            {recentPlst}
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
    marginVertical: 20, 
    justifyContent: 'space-between', 
    gap: 20
  }
});
