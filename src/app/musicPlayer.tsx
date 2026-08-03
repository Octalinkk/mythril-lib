import Header from '@/components/Header';
import RandomIcon from '@/components/RandomIcon';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import TrackPlayer, { Event, useIsPlaying, useProgress } from "@rntp/player";
import { File } from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextTicker from 'react-native-text-ticker';

import { Artist, getArtistById, updateArtist } from '@/db/ArtistsManager';
import { getArtistsBySongId } from '@/db/SongsArtistsManager';
import { Song, getSongById, updateSong } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';
import { FontAwesome6 } from '@expo/vector-icons';

type MediaItem = {
    mediaId: string;
    url: string;
    title: string;
    artist: string;
    artworkUrl: string;
}

function getCoverSource(cover: string) {
    const file = new File(cover)
    if (!cover || cover =="" || !file.exists) {
        return require('../res/def_cover.png');
    }
    return { uri: `${cover}?cache=${Date.now()}` };
}

function getArtistName(artists: Artist[]):string {
    if (artists.length >= 1) {
        return artists.map(artist => artist.name).join(' | ');
    }
    else return "unknown"
}


function getSongDuration(dur:number): string{
    const minutes = Math.floor(dur / 60).toString()
    const seconds = Math.floor(dur % 60)
    const dispSec = seconds<10 ? "0"+seconds.toString() : seconds.toString();
    return minutes + ':' + dispSec;
}

async function getArtistsforSongId(songId:number){
    const artistsIds = await Promise.resolve(
        getArtistsBySongId(songId)
    );
    const artists = await Promise.all(
        artistsIds.map(id => getArtistById(+id))
    );
    return artists.filter((artist): artist is Artist => artist !== null);
}


export default function MusicPlayer() {
    const params = useLocalSearchParams<{
        ids: string,
        softOpen: "true" | "false"
        startIdx: string
    }>();
    const playing = useIsPlaying();
    const { position, duration } = useProgress();
    const [shuffle, setShuffle] = useState<boolean>(false)

    const [curr_display_song, setCurrDisplaySong] = useState<Song>({
        id: 0,
        name: "",
        file_path: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });
    const [curr_display_artists, setCurrDisplayArtists] = useState<Artist[]>([]);

    const used_event = useRef<boolean>(false);
    const isInit = useRef<boolean>(false);
    const expectedInitMediaId = useRef<string | null>(null);

    const last_position = useRef<number>(0);
    const curr_song = useRef<Song>(null);
    const curr_artists = useRef<Artist[]>(null);
    
    useEffect(() => {

        

        async function getArtistDisplay(songId:number){
            const artists = await getArtistsforSongId(songId)
            setCurrDisplayArtists(artists)
        }



        async function loadSongs() {

            if(TrackPlayer.getActiveMediaItem()){
                last_position.current = position
                const id = Number(TrackPlayer.getActiveMediaItem()?.mediaId)
                if (id){
                    curr_song.current = await getSongById(id)

                    if (curr_song.current){
                        curr_artists.current = await getArtistsforSongId(curr_song.current?.id)
                    }
                }
                else{
                    curr_song.current = null
                }
                
            }

            

            let ids:number[] = params.ids.split(",").map((i) => Number(i))
            
            
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
            
            expectedInitMediaId.current = all_songs[Number(params.startIdx)]?.mediaId ?? null;

            const dispSong = results[Number(params.startIdx)];
            if (dispSong) {
                setCurrDisplaySong(dispSong);
            }

            if( curr_display_song.id != 0 ) {            
                getArtistDisplay(curr_display_song.id)
            }
            else{
                getArtistDisplay(results[Number(params.startIdx)]?.id ?? curr_display_song.id)            
            }

            

            const areSame = Number(TrackPlayer.getActiveMediaItem()?.mediaId) == Number(all_songs[Number(params.startIdx)].mediaId)
            // Ici que ça fait la détection de si la même musique ou pas
            //Switch from Song -> Playlist
            if (TrackPlayer.getQueue().length == 1 && all_songs.length > 1 && areSame){
                const index = all_songs.findIndex(function(song) { return song.mediaId === TrackPlayer.getActiveMediaItem()?.mediaId})
                await TrackPlayer.addMediaItems(all_songs.slice(index+1))
            }
            //Switch from Playlist -> Song
            else if (TrackPlayer.getQueue().length > 1 && all_songs.length == 1 && areSame && params.softOpen == "false"){
                const idx = TrackPlayer.getActiveMediaItemIndex() ?? 0;
                await TrackPlayer.removeMediaItems(idx+1, TrackPlayer.getQueue().length)   
                await TrackPlayer.removeMediaItems(0, idx)     
                
            }
            else if (TrackPlayer.getQueue().length == 1 && all_songs.length == 1 && areSame){}
            else {
                if(params.softOpen == "false" && !areSame){
                    TrackPlayer.setMediaItems(all_songs);     
                }
            }

               
            if (Number(params.startIdx) != 0 && !areSame){
                TrackPlayer.skipToIndex(Number(params.startIdx))
            } 

            if (!playing){
                TrackPlayer.play()
            }
            
            
            isInit.current = true
        }

        loadSongs().catch(console.error);

        TrackPlayer.addEventListener(Event.MediaItemTransition, async ({ item, index }) => {
            if(!used_event.current){
                used_event.current = true

                if (isInit.current) {                
                    isInit.current = false
                    if (item?.mediaId !== expectedInitMediaId.current) {
                        return
                    } 
                }

                if (!playing) {
                    TrackPlayer.play()
                }
                if(item?.mediaId != undefined){
                    //null à chaque réouverture du player car remit le useRef par défaut (null) 
                    if (curr_song.current != null && curr_artists.current != null){
                        //for previous song
                        curr_song.current.time_listened += last_position.current
                        curr_artists.current.map(artist => artist.time_listened += last_position.current)
                        updateSong(curr_song.current)
                        await Promise.all(
                            curr_artists.current.map(artist => updateArtist(artist))
                        );
                    }
                    curr_song.current = await getSongById(Number(item?.mediaId))
                    if (curr_song.current != null){
                        curr_artists.current = await getArtistsforSongId(curr_song.current?.id)
                        curr_song.current.time_started += 1
                        curr_song.current.last_time_played = new Date().toISOString()
                        curr_artists.current.map(artist => artist.time_started += 1)
                        curr_artists.current.map(artist => artist.last_time_played = new Date().toISOString())
                        setCurrDisplaySong(curr_song.current)
                        setCurrDisplayArtists(curr_artists.current)
                        updateSong(curr_song.current)
                        await Promise.all(
                            curr_artists.current.map(artist => updateArtist(artist))
                        );
                    }
                    else {curr_artists.current = []}
                }
            }
        });
        
        
    }, []);


    return (
        <LinearGradient 
              style={globalStyles.main_container}
              colors={[colors.grad_prim, colors.grad_sec, colors.grad_tri]}
              start={{x:0, y:0}}
              end={{x:1, y:1}}
            >
            <Header />
            <View style={styles.container}>
                <Image source={getCoverSource(curr_display_song.cover)} style={styles.cover}/>

                <View style={styles.title_container}>
                    <View style={styles.info_container}>
                        <TextTicker scrollSpeed={50} loop bounce numberOfLines={1} style={styles.title}>{curr_display_song.name}</TextTicker>
                        <Text style={styles.artists}>{getArtistName(curr_display_artists)}</Text>
                    </View>
                    <View style={styles.random_container}>                        
                        <RandomIcon/>
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
                    <TouchableOpacity style={styles.skip_btn} onPress={() => {TrackPlayer.skipToPrevious(); used_event.current = false}}>
                        <MaterialIcons name="skip-previous" size={30} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.play_btn} onPress={() => { playing ? TrackPlayer.pause() : TrackPlayer.play() }}>
                        {playing ? <FontAwesome6 name="pause" size={35} color={"#000000"} /> : <FontAwesome name="play" style={{marginLeft: 5}} size={30} color={"#000000"} />}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.skip_btn} onPress={() => {TrackPlayer.skipToNext() ; used_event.current = false}}>
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