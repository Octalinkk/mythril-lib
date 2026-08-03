
import Header from '@/components/Header';
import { useCallback } from 'react';

import AlbumListItem from '@/components/AlbumListItem';
import FloatingPlayer from '@/components/floatingPlayer';
import { getAllAlbumsOrdered } from '@/db/AlbumsManager';
import { Artist } from '@/db/ArtistsManager';
import { colors, globalStyles } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

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
      <FlatList 
            style={styles.items_container}
            data={albums}
            // TODO joue toute les musique en commençant par 1 car play_ids. Refaire tout le systeme de lecture pour faire en sorte mettre ll'ID de la musique séléctionné en premier (pas déplacer mais ajuster l'ID)
            renderItem={({item}) => <AlbumListItem id={item.id}/>}
            keyExtractor={item => "album:"+item.id}
            ListHeaderComponent={
                <View style={styles.header}>          
                  <Text style={styles.title}>Albums</Text>
                </View>
            }      
            ListEmptyComponent={<Text style={styles.filler_text}  key={"album:None"}>No Album found</Text>}     
            ItemSeparatorComponent={<View style={{height:10}}></View>}   
            maxToRenderPerBatch={5}   
            initialNumToRender={2}
            windowSize={5}
            ListFooterComponent={<View style={{height:50}}></View>}
      />
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
    marginBottom: 20
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
    marginTop: 20
  },
  filler_text: {
    flex: 1,
    color: colors.secondary,
    fontFamily: 'SpaceGrotesk_400Regular',
  }
  
  
});
