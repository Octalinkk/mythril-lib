import Header from '@/components/Header';
import { File } from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import RandomIcon from '@/components/RandomIcon';
import SongListItem from '@/components/SongListItem';
import { getPlaylistById, Playlist } from '@/db/PlaylistsManager';
import { getSongById, Song } from '@/db/SongsManager';
import { getSongsByPlaylistId } from '@/db/SongsPlaylistsManager';
import { colors, globalStyles } from '@/styles/global';
import { SimpleLineIcons } from '@expo/vector-icons';
import TrackPlayer from '@rntp/player';


function getCoverSource(cover: string) {
    const file = new File(cover)
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: `${cover}?cache=${Date.now()}` };
}

function getSongsList(songs:Song[]){
    if (songs.length > 0){
        return songs.map(song => <SongListItem song_id={song.id} play_ids={(songs.slice(songs.indexOf(song), songs.length)).map(song => song.id)} key={"listed_song:"+song.id}/>)
    }
    else{
        return <Text style={styles.filler_text}>Playlist empty</Text>
    }
}

async function getSongsforPlaylist(id:number){
    const songsId = await Promise.resolve(
        getSongsByPlaylistId(id)
    );
    const songs = await Promise.all(
        songsId.map(id => getSongById(+id))
    );
    return songs.filter((songs): songs is Song => songs !== null);
}

export default function PlaylistProfile() {
    const params = useLocalSearchParams<{
        id: string;
    }>();

    const [playlist, setPlaylist] = useState<Playlist>({
        id: 0,
        name: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });
    const [songs, setSongs] = useState<Song[]>([]);
    const [shuffle, setShuffle] = useState<boolean>(false)

    useFocusEffect(
        useCallback(() => {
            getPlaylistById(Number(params.id)).then(result => {
                if (result) {
                    setPlaylist(result)
                    getSongsforPlaylist(result.id).then(songs => {
                        if (songs) setSongs(songs);
                    });
                }
                
            });
        }, [params.id])
    );

    return (
        <LinearGradient 
              style={globalStyles.main_container}
              colors={[colors.grad_prim, colors.grad_sec, colors.grad_tri]}
              start={{x:0, y:0}}
              end={{x:1, y:1}}
            >
            <Header />
            <ScrollView style={{marginBottom: 50}}>
                <View style={styles.header}>
                    <Link href={{
                        pathname: "/albumSettings",
                        params: {id:[playlist.id.toString()]},
                        }} push asChild>
                        <TouchableOpacity>
                            <SimpleLineIcons name="options-vertical" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </Link>
                </View>
                <View style={styles.main_scroll}>
                    <View style={styles.pfp_container}>
                        <Image source={getCoverSource(playlist.cover)} style={styles.cover}/>
                    </View>        
                    <Text style={styles.name}>{playlist.name}</Text>
                    <View style={styles.play_header}>
                        <Link href={{
                        pathname: "/musicPlayer",
                        params: {ids:songs.map(song => song.id.toString())},
                        }}
                        onPress={async () => {
                            
                        }} push asChild>
                            <TouchableOpacity style={styles.btn_play}>
                                <Text style={styles.btn_text}>Play</Text>
                            </TouchableOpacity>
                        </Link>
                        <TouchableOpacity style={{
                        justifyContent: 'center',
                        alignItems: 'center',}} 
                        onPress={() => {
                            TrackPlayer.setShuffleEnabled(!shuffle);
                            setShuffle(!shuffle);
                        }}>
                            <RandomIcon isShuffled={shuffle} />
                        </TouchableOpacity>
                    </View>
                    {getSongsList(songs)}
                </View>
            </ScrollView>
            
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    main_scroll:{
        flex:1,
        paddingVertical: 30,
        gap: 10,
        paddingHorizontal: 20,
    },
    header:{
        flex: 1,
        flexDirection: 'row-reverse',
        paddingHorizontal: 20,
        marginTop: 20
    },
    play_header:{
        flex: 1,
        flexDirection: 'row',
        marginVertical: 20,
        gap: 20
    },
    btn_play:{
        flex:0.9,
        height: 40,
        backgroundColor: colors.primary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn_text:{
        fontSize: 20,
        color: "#000000",        
        fontFamily: 'SpaceGrotesk_400Regular'
    },
    pfp_container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cover: {
        flex: 1,
        width: 200,
        height: 200,
        borderRadius: 30
    },
    items_container_md: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 30, 
        justifyContent: 'space-between', 
        gap: 20,
    },
    name:{
        flex:1,
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 40,
        color: colors.primary,
        fontFamily: 'SpaceGrotesk_400Regular'
    },
    context:{
        flex: 1,
        fontSize: 18,
        color: colors.secondary,
        fontFamily: 'SpaceGrotesk_400Regular',
        justifyContent: 'center',
        textAlign: 'left',
        alignItems: 'center'
    },   
    title: {
        flex: 1,
        fontSize: 30,
        fontFamily: 'SpaceGrotesk_700Bold',
        textAlign: 'left',
        color: colors.primary,
        marginTop: 30,
        marginBottom: 20
    },
    filler_text: {
        flex: 1,
        color: colors.secondary,
        fontFamily: 'SpaceGrotesk_400Regular',
    },
});