
import Header from '@/components/Music/Header';
import { useCallback, useEffect } from 'react';

import FloatingPlayer from '@/components/Music/floatingPlayer';
import CreatPlaylistModal from '@/components/Music/Playlists/addPlaylist';
import PlaylistListItem from '@/components/Music/Playlists/PlaylistListItem';
import { getAllCustomPlaylists, getAllSystemPlaylists, Playlist } from '@/db/PlaylistsManager';
import { checkAllSongPlaylistIntegrity } from '@/Managers/PlaylistManager';
import { colors, globalStyles } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function getPlaylistLST(playlists: Playlist[]){  
  if (playlists.length !== 0){
    return playlists.map(playlist => <PlaylistListItem id={playlist.id} key={"playlist_item:"+playlist.id}/>)
  }
  else{
    return (<Text style={styles.filler_text}>Press + to add a new playlist</Text>)
  }
}

function getSystemPlaylistLST(playlists: Playlist[]){  
  if (playlists.length !== 0){
    return playlists.map(playlist => <PlaylistListItem id={playlist.id} isLocked={true} key={"sys_playlist_item:"+playlist.id}/>)
  }
}

export default function PlaylistScreen() {

  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [sysPlaylists, setSysPlaylists] = useState<Playlist[]>([])
  const [visible, setVisible] = useState<boolean>(false)

  //TODO quand tu ajoute une playliste, ouvre

  useEffect(() => {
      checkAllSongPlaylistIntegrity()
  }, []);

  useFocusEffect(
    useCallback(() =>{
      async function loadInfo(){        
          const plSys = await getAllSystemPlaylists()
          if (plSys) {
              setSysPlaylists(plSys)              
          };

          const plCustom = await getAllCustomPlaylists()
          if (plCustom) {
              setPlaylists(plCustom)              
          };
      }
      loadInfo()
    }, [playlists]) 
  )

  function openCreate(){
    setVisible(true)
  }

  function closeCreate(){
    setVisible(false)
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

        <View style={styles.container}>
          <PlaylistListItem id={1} isLocked={true} key={"sys_playlist_item:1"}/>
        </View>

        <View style={styles.header}>          
          <Text style={styles.title}>Your playlist</Text>
          <TouchableOpacity style={styles.icon} onPress={openCreate}>
            <Text style={styles.icon_text}>+</Text>
          </TouchableOpacity>
          <CreatPlaylistModal visible={visible} onClose={closeCreate}/>
        </View>
        <View style={styles.container}>
          {getPlaylistLST(playlists)}
        </View>
          
      </ScrollView>
      <FloatingPlayer />
    </LinearGradient>
  );
}
const styles = StyleSheet.create({

  header:{    
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    flex: 0.9,
    fontSize: 20,
    fontFamily: 'SpaceGrotesk_400Regular',
    color: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    flex: 0.1,
    alignItems: 'flex-end',
  },
  icon_text: {
    fontSize: 30,
    fontFamily: 'SpaceGrotesk_400Regular',
    color: colors.secondary,
    justifyContent: 'center',
  },
  main_scroll: {
    flex:1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 10
  },
  container:{
    marginVertical: 20,
    flex:1,
    gap:10,
  },
  filler_text: {
      flex: 1,
      fontSize: 15,
      textAlign: 'center',
      color: colors.secondary,
      fontFamily: 'SpaceGrotesk_400Regular',
  },
  
  
});
