
import ArtistItem from '@/components/Music/Artists/ArtistItem';
import SongItem from '@/components/Music/Songs/SongItem';
import { Artist, getMostRecentArtists } from '@/db/ArtistsManager';
import { useCallback } from 'react';

import PlaylistListItem from '@/components/Music/Playlists/PlaylistListItem';
import { getMostRecentPlst, Playlist } from '@/db/PlaylistsManager';
import { getMostRecentSongs, Song } from '@/db/SongsManager';
import { deleteAllDatas, exportDatas } from '@/Managers/StorageManager';
import { colors, globalStyles } from '@/styles/global';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import TrackPlayer, { PlayerCommand } from "@rntp/player";
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

function getRecentSong(songs:Song[]){
  let recentSong = []
  if (songs.length > 0){
    for (const item of songs) {
        recentSong.push(<SongItem song_id={item.id} play_ids={[]} key={"song:"+item.id}/>)
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
        recentPlst.push(<PlaylistListItem id={item.id} key={"playlist:"+item.id}/>)
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
        recentArtist.push(<ArtistItem artist_id={item.id} key={"artist:"+item.id}/>)
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

  


  useFocusEffect(
    useCallback(() =>{
      getMostRecentSongs().then(result => {
          if (result) setSong(result);
      });
    }, [recSongs]) 
  )

  useFocusEffect(
    useCallback(() =>{
      getMostRecentPlst().then(result => {
          if (result) setPlaylist(result);
      });
    }, [recPlaylists]) 
  )

  useFocusEffect(
    useCallback(() =>{
      getMostRecentArtists().then(result => {
          if (result) setArtist(result);
      });
    }, [recArtists]) 
  )

  useEffect(() => {
    try{
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

      <ScrollView style={styles.main_scroll}>
        <Text style={styles.title}>Datas</Text>
        <TouchableOpacity style={styles.button_container} onPress={async () => await exportDatas()}>
          <MaterialIcons name="save-alt" size={30} color={colors.primary} />
          <Text style={styles.button_text}>Save datas</Text>
        </TouchableOpacity> 
        <TouchableOpacity style={styles.button_container_danger} onPress={async () => await deleteAllDatas()}>
          <MaterialIcons name="delete-outline" size={30} color={colors.primary} />
          <Text style={styles.button_text}>Erase datas</Text>
        </TouchableOpacity>
        
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
    paddingHorizontal: 20,
  },  
  button_container:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    gap: 20,
    maxHeight: 50,
    borderWidth: 2,
    borderRadius: 30,
    borderColor: colors.primary,
    marginVertical: 10
  },
  button_container_danger:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    maxHeight: 50,
    gap: 20,
    borderRadius: 30,
    backgroundColor: colors.danger,
    marginVertical: 10
  },
  button_icon:{
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button_text:{
    flex: 0.8,
    flexDirection: 'row',
    fontSize: 20,
    color: colors.primary,    
    justifyContent: 'center',
    alignItems: 'center',
  },
  filler_text: {
    flex: 1,
    color: colors.secondary,
    fontFamily: 'SpaceGrotesk_400Regular',
  }
});
