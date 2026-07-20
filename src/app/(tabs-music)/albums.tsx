
import Header from '@/components/Header';
import { useCallback } from 'react';

import AlbumListItem from '@/components/AlbumListItem';
import FloatingPlayer from '@/components/floatingPlayer';
import { Album, getAllAlbumsOrdered } from '@/db/AlbumsManager';
import { Artist } from '@/db/ArtistsManager';
import { colors, globalStyles } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

function getRecentAlbums(albums:Album[]){
  let album = []

  if (albums.length > 0){
    for (const item of albums) {
        album.push(<AlbumListItem id={item.id} key={"album:"+item.id}/>)
    }
  }
  else {
    album.push(<Text style={styles.filler_text}  key={"album:None"}>No Album found</Text>)
  }
  return album
}
export default function AlbumsScreen() {

  const [albums, setAlbums] = useState<Artist[]>([]);

  useFocusEffect(
      useCallback(() =>{
        getAllAlbumsOrdered().then(result => {
            if (result) setAlbums(result);
        });
      }, [albums]) 
    )
  

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
          <Text style={styles.title}>Albums</Text>
        </View>
        <View style={styles.items_container}>
          {getRecentAlbums(albums)}
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
  items_container: {    
    flex: 1,
    gap: 10,
    marginVertical: 20
  },
  filler_text: {
    flex: 1,
    color: colors.secondary,
    fontFamily: 'SpaceGrotesk_400Regular',
  }
  
  
});
