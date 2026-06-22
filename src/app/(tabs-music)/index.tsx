
import Header from '@/components/Header';
import SongItem from '@/components/SongItem';

import { getMostRecent, Song } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { Suspense, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {

  const [recSongs, setSong] = useState<Song[]>([]);
    
  useEffect(() => {
      getMostRecent().then(result => {
          if (result) setSong(result);
      });
  }, []);

  let recentSong = []
  if (recSongs.length > 0){
    for (const item of recSongs) {
        recentSong.push(<SongItem song_id={item.id} key={item.id}/>)
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
        <Text style={styles.title}>Recent Song</Text>
        <ScrollView horizontal={true}>
          <View  style={styles.items_container_sm}>
            <Suspense fallback={<Text>Chargement...</Text>}>
              {recentSong}
            </Suspense>
          </View>
        </ScrollView>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  title: {
    flex: 1,
    fontSize: 30,
    fontFamily: 'SpaceGrotesk_700Bold',
    color: colors.primary,
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
  }
});
