
import Header from '@/components/Header';
import { useCallback } from 'react';

import ArtistItem from '@/components/ArtistItem';
import FloatingPlayer from '@/components/floatingPlayer';
import { Artist, getAllArtistsOrdered } from '@/db/ArtistsManager';
import { colors, globalStyles } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';


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
      <FlatList 
      style={styles.main_scroll}
      data={artists}
      // TODO joue toute les musique en commençant par 1 car play_ids. Refaire tout le systeme de lecture pour faire en sorte mettre ll'ID de la musique séléctionné en premier (pas déplacer mais ajuster l'ID)
      renderItem={({item}) => <ArtistItem artist_id={item.id} />}
      keyExtractor={item => "artist:"+item.id}
      ListHeaderComponent={
          <View>
              <View style={styles.header}>          
                <Text style={styles.title}>Artists</Text>
              </View>
          </View>
      }      
      numColumns={2}
      ListEmptyComponent={<Text style={styles.filler_text}  key={"artist:None"}>No Artists found</Text>}     
      ItemSeparatorComponent={<View style={{height:20}}></View>}     
      columnWrapperStyle={{ gap: 20 }}
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
