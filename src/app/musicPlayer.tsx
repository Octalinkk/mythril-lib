import Header from '@/components/Header';
import Slider from '@react-native-community/slider';
import TrackPlayer, { Event, useIsPlaying, useProgress } from "@rntp/player";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";

import { Song, getSongById } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';

type MediaItem = {
    mediaId: string;
    url: string;
    title: string;
    artist: string;
    artworkUrl: string;
}

function getCoverSource(cover: string) {
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: cover };
}

export default function MusicPlayer() {
    const params = useLocalSearchParams<{
        ids: string[];
    }>();
    const playing = useIsPlaying();
    const { position, duration } = useProgress();

    const [songs, setSongs] = useState<Song[]>([{
            id: 0,
            name: "",
            file_path: "",
            cover: "",
            last_time_played: "",
            time_listened: 0,
            time_started: 0
        }]);

    const [curr_song, setCurrSong] = useState<Song>({
            id: 0,
            name: "",
            file_path: "",
            cover: "",
            last_time_played: "",
            time_listened: 0,
            time_started: 0
        });
    
    useEffect(() => {
        async function loadSongs() {
        let ids:number[] = []


        if(params.ids.length > 1){
            for (const id in params.ids) {
                ids.push(+id)
            }
            ids = ids.filter(result => result != 0)
        }
        else {
            ids = [+params.ids]
        }
        
        
        let results = await Promise.all(
            ids.map(id => getSongById(+id))
        );

        results = results.filter(result => result != null)

        const all_songs: MediaItem[] = results
            .map(result => ({
                mediaId: result!.id.toString(),
                url: result!.file_path,
                title: result!.name,
                artist: '',
                artworkUrl: result!.cover,
            }));


        if (results[0]) {
            setCurrSong(results[0]);            
        }
        TrackPlayer.setMediaItems(all_songs, 0);
    }

    loadSongs().catch(console.error);
        

    if (!playing) {
        TrackPlayer.play()
    }
        
    }, []);
   
    TrackPlayer.addEventListener(Event.MediaItemTransition, ({ item, index }) => {
        //console.log('Played:', curr_song.name);
        //console.log('Now playing:', item?.title, 'at index', index);
    });

    return (
        <LinearGradient 
              style={globalStyles.main_container}
              colors={[colors.grad_prim, colors.grad_sec, colors.grad_tri]}
              start={{x:0, y:0}}
              end={{x:1, y:1}}
            >
            <Header />
            <Slider value={position} maximumValue={duration} style={{marginTop: 100}}/>
            <TouchableOpacity onPress={() => {playing ? TrackPlayer.pause() : TrackPlayer.play()}}>
                <Text>{playing ? 'Pause' : 'Play'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {TrackPlayer.skipToNext()}}>
                <Text>Skip</Text>
            </TouchableOpacity>
            <Text>{curr_song.name}</Text>
            <Image source={getCoverSource(curr_song.cover)}/>

        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        width: 100,
        height: 140,
        backgroundColor: '#b8b8b81b',
        borderRadius: 20,
        padding: 10,
        paddingBottom: 5
    },
    image:{
        width: 80,
        height: 80,
        borderRadius: 20,
    },
    title_container: {
        flex:1,
        flexDirection: 'row'
    },
    title:{
        flex: 0.85,
        flexDirection: 'row',
        fontSize: 11,
        color: colors.primary,
        fontFamily: 'SpaceGrotesk_700Bold',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingRight: 5
    },
    icon:{
        flex: 0.15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});