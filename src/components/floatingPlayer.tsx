import { getSongById, Song } from "@/db/SongsManager";
import { colors } from "@/styles/global";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import TrackPlayer, { Event, useIsPlaying } from "@rntp/player";
import { File } from "expo-file-system";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import TextTicker from "react-native-text-ticker";

function getCoverSource(cover: string) {
    const file = new File(cover)
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: `${cover}?cache=${Date.now()}` };
}


export default function FloatingPlayer () {

    const [song, setSong] = useState<Song>({
        id: 0,
        name: "",
        file_path: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });
    const playing = useIsPlaying();


    useEffect(() => {
        async function loadInfo(){
            if (playing){
                const result = await getSongById(Number(TrackPlayer.getActiveMediaItem()?.mediaId))
                if (result) {
                    setSong(result)
                };
            }
            
        }
        loadInfo()
    }, []);

    useEffect(() => {
        TrackPlayer.addEventListener(Event.MediaItemTransition, async ({ item, index }) => {
            if(item?.mediaId != undefined){
                const result = await getSongById(Number(item?.mediaId))
                if (result){
                    setSong(result)
                }
            }
        });
    }, []);

    //condition pour cacher
    if (TrackPlayer.getActiveMediaItem() == null) return <View></View>;

    return (
        <Link href={{
            pathname: "/musicPlayer",
            params: {ids:[song.id.toString()]},
            }}
            push asChild>
            <TouchableOpacity style={styles.container}>
                <Image source={getCoverSource(song.cover)} style={styles.image}/>
                <View style={styles.title_container}>
                    <TextTicker scrollSpeed={40} loop bounce numberOfLines={1} style={styles.title}>{song.name}</TextTicker>
                </View>
                <TouchableOpacity onPress={() => { playing ? TrackPlayer.pause() : TrackPlayer.play() }}>
                    {playing ? <FontAwesome6 name="pause" size={35} color={colors.primary} /> : <FontAwesome name="play" style={{marginLeft: 5}} size={30} color={colors.primary} />}
                </TouchableOpacity>
            </TouchableOpacity>
        </Link>
    );

};

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'row',
        minHeight: 70,
        backgroundColor: '#b8b8b81b',
        borderRadius: 20,
        padding: 10,
        paddingRight: 30,
        gap: 10,
        marginBottom: 10,
        marginHorizontal: 10,
        alignItems: 'center'
    },
    image:{
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    title_container: {
        flex:1
    },
    title:{
        fontSize: 16,
        color: colors.primary,
        fontFamily: 'SpaceGrotesk_700Bold',
        alignItems: 'center'
    },
    profile_container:{
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%'
    },
    profile_title:{
        fontSize: 20,
        color: colors.primary,
        fontFamily: 'SpaceGrotesk_700Bold',
    },
    subtitle:{
        flex: 0.4,
        flexDirection: 'row',
        fontSize: 10,
        color: colors.secondary,
        fontFamily: 'SpaceGrotesk_400Regular',
        alignItems: 'center'
    },
    icon:{
        flex: 0.1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});