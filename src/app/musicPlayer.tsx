import Header from '@/components/Header';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import TrackPlayer, { Event, useIsPlaying, useProgress } from "@rntp/player";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextTicker from 'react-native-text-ticker';

import { Artist, getArtistById } from '@/db/ArtistsManager';
import { getArtistsBySongId } from '@/db/SongsArtistsManager';
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

function getArtistName(artists: Artist[]):string {
    if (artists.length >= 1) {
        return artists.map(artist => artist.name).join(' | ');
    }
    else return "unknown"
}

function getRandomIcon(){
    if (TrackPlayer.isShuffleEnabled()) {
        return <FontAwesome name="random" size={30} color={colors.primary} />
    }
    else{
        return <FontAwesome name="random" size={30} color={"#b0b0b02e"} />
    }
}

function getPlayIcon(){
    if (TrackPlayer.isPlaying()) {
        return <FontAwesome name="pause" size={30} color={"#000000"} />
    }
    else{
        return <FontAwesome name="play" style={{marginLeft:5}} size={30} color={"#000000"} />
    }
}

function getSongDuration(dur:number): string{
    const minutes = Math.floor(dur / 60);
    const seconds = Math.floor(dur % 60);
    return minutes + ':' + seconds;
}

async function updateSongStats(id:number, last_time_played: string, time_listened: number, time_started: number){
    let song = await Promise.resolve(getSongById(id))
    if (song){
        song.last_time_played = last_time_played
    }
    
}

export default function MusicPlayer() {
    const params = useLocalSearchParams<{
        ids: string;
    }>();
    const playing = useIsPlaying();
    const { position, duration } = useProgress();

    const [curr_song, setCurrSong] = useState<Song>({
        id: 0,
        name: "",
        file_path: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });
    
    const [curr_artists, setCurrArtists] = useState<Artist[]>([]);
    
    useEffect(() => {
        async function loadSongs() {
        let ids:number[] = params.ids.split(",").map((i) => Number(i))
        
        console.log(ids)
        
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

        
        const artistsIds = await Promise.resolve(
            getArtistsBySongId(curr_song.id)
        );

        const artists = await Promise.all(
            artistsIds.map(id => getArtistById(+id))
        );
        const validArtists = artists.filter((artist): artist is Artist => artist !== null);
        setCurrArtists(validArtists)



        TrackPlayer.setMediaItems(all_songs, 0);
    }

    loadSongs().catch(console.error);
        
    

    if (!playing) {
        //TrackPlayer.play()
    }
        
    }, []);
   
    TrackPlayer.addEventListener(Event.MediaItemTransition, ({ item, index }) => {
    
        //console.log('Played:', curr_song.name);
        //console.log('Now playing:', item?.title, 'at index', index);
        if(item?.mediaId != undefined && +item?.mediaId == curr_song.id) {
            curr_song.time_started += 1
        }
        else if (item?.mediaId != undefined && +item?.mediaId != curr_song.id) {
            curr_song.last_time_played = new Date().toLocaleString()
            curr_song.time_listened += Math.round(position)
        }
    });
    

    return (
        <LinearGradient 
              style={globalStyles.main_container}
              colors={[colors.grad_prim, colors.grad_sec, colors.grad_tri]}
              start={{x:0, y:0}}
              end={{x:1, y:1}}
            >
            <Header />
            <View style={styles.container}>
                <Image source={getCoverSource(curr_song.cover)} style={styles.cover}/>

                <View style={styles.title_container}>
                    <View style={styles.info_container}>
                        <TextTicker scrollSpeed={50} loop bounce numberOfLines={1} style={styles.title}>{curr_song.name}</TextTicker>
                        <Text style={styles.artists}>{getArtistName(curr_artists)}</Text>
                    </View>
                    <View style={styles.random_container}>
                        <TouchableOpacity  onPress={() => { TrackPlayer.setShuffleEnabled(!TrackPlayer.isShuffleEnabled())}}>
                            {getRandomIcon()}
                        </TouchableOpacity>   
                        <Text style={styles.dur}>{getSongDuration(duration)}</Text>
                    </View>                 
                </View>

                <Slider style={styles.slider} value={position} maximumValue={duration} thumbSize={20}
                minimumTrackTintColor={colors.primary}  
                maximumTrackTintColor={colors.secondary}
                thumbTintColor={colors.primary} 
                onSlidingComplete={(value) => {
                    TrackPlayer.seekTo(value)
                }}/>
                <View style={styles.controls}>
                    <TouchableOpacity style={styles.skip_btn} onPress={() => {TrackPlayer.skipToNext()}}>
                        <MaterialIcons name="skip-previous" size={30} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.play_btn} onPress={() => {playing ? TrackPlayer.pause() : TrackPlayer.play()}}>
                        {getPlayIcon()}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.skip_btn} onPress={() => {TrackPlayer.skipToNext()}}>
                        <MaterialIcons name="skip-next" size={30} color="black" />
                    </TouchableOpacity>
                </View>
                
                
                
                
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 20
    },
    cover:{
        width: 280,
        height: 280,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10
    },
    title_container: {
        flex:1,
        flexDirection: 'row',
        maxHeight: 100,
        marginTop: 20
    },
    info_container: {
        flex:0.85,
        flexDirection: 'column'
    },
    random_container:{
        flex:0.15,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10 
    },
    dur:{
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        color: colors.secondary,
    },
    title:{
        fontSize: 35,
        color: colors.primary,
        fontFamily: 'SpaceGrotesk_700Bold',
        alignItems: 'center',
    },
    artists:{
        flexDirection: 'row',
        fontSize: 15,
        color: colors.secondary,
        fontFamily: 'SpaceGrotesk_700Bold',
        alignItems: 'center',
        paddingTop: 5,
        paddingRight: 5
    },
    slider: {
        height: 40,
    },
    controls: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 20,
        maxHeight: 80,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 25,
    },
    play_btn: {
        width: 80,
        height: 80,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%'
    },
    skip_btn: {
        width: 60,
        height: 60,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%'
    }
});