
import Header from '@/components/Header';
import { useCallback } from 'react';

import CreatPlaylistModal from '@/components/addPlaylist';
import ArtistItem from '@/components/ArtistItem';
import FloatingPlayer from '@/components/floatingPlayer';
import { Artist, getAllArtistsOrdered } from '@/db/ArtistsManager';
import { colors, globalStyles } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

function getRecentArtists(artists:Artist[]){
  let artist = []

  if (artists.length > 0){
    for (const item of artists) {
        artist.push(<ArtistItem artist_id={item.id} key={"artist:"+item.id}/>)
    }
  }
  else {
    artist.push(<Text style={styles.filler_text}  key={"artist:None"}>No Artists found</Text>)
  }
  return artist
}
export default function ArtistsScreen() {

  const [artists, setArtist] = useState<Artist[]>([]);
  const [visible, setVisible] = useState<boolean>(false)

  useFocusEffect(
      useCallback(() =>{
        getAllArtistsOrdered().then(result => {
            if (result) setArtist(result);
        });
      }, [artists]) 
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

        <View style={styles.header}>          
          <Text style={styles.title}>Artists</Text>
          <CreatPlaylistModal visible={visible} onClose={closeCreate}/>
        </View>
        <View style={styles.items_container_md}>
          {getRecentArtists(artists)}
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
