
import Header from '@/components/Header';
import SongItem from '@/components/SongItem';

import { Song } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';
import { LinearGradient } from 'expo-linear-gradient';
import { Suspense, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {


  "file:///storage/emulated/0/DCIM/Octa/new__profile_picture_by_octalink_private_dm6ojbm-pre.jpg"

  const [song, setSong] = useState<Song>({
          id: 0,
          name: "",
          file_path: "",
          cover: "",
          last_time_played: "",
          time_listened: 0,
          time_started: 0
      });

  let recentSong = 
  <Suspense fallback={<Text>Chargement...</Text>}>
      <SongItem song_id={1} />
      <SongItem song_id={2} />
      <SongItem song_id={3} />
      <SongItem song_id={4} />
      <SongItem song_id={5} />
  </Suspense>

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
            {recentSong}
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
