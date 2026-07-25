import { getPlaylistById, Playlist } from "@/db/PlaylistsManager";
import { getSongCountByPlstId } from "@/db/SongsPlaylistsManager";
import { colors } from "@/styles/global";
import { SimpleLineIcons } from "@expo/vector-icons";
import { File } from "expo-file-system";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Id = {
  id: number;
};


function getCoverSource(cover: string) {
    const file = new File(cover)
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: `${cover}?cache=${Date.now()}` };
}


export default function PlaylistListItem (id: Id) {

    const [playlist, setPlaylist] = useState<Playlist>({
        id: 0,
        name: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });
    const [count, setCount] = useState<number>(0)
    
    useFocusEffect(
        useCallback(() => {
            async function loadInfo(){
                const result = await getPlaylistById(id.id)
                if (result) {
                    setPlaylist(result)
                    getSongCountByPlstId(id.id).then(result => {
                        if (result) setCount(result.count);
                    });
                };
            }
            loadInfo()
        }, [id.id])
    );

    return (
        <Link href={{
            pathname: "/playlistProfile",
            params: {id:[playlist.id.toString()]},
            }}
            push asChild>
            <TouchableOpacity style={styles.container}>
                <Image source={getCoverSource(playlist.cover)} style={styles.image}/>
                <View style={styles.title_container}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{playlist.name}</Text>
                    <Text style={styles.subtitle}>{count} songs</Text>
                </View>
                    <Link href={{
                        pathname: "/playlistSettings",
                        params: {id:[playlist.id.toString()]},
                        }} push asChild>
                        <TouchableOpacity style={styles.icon}>
                            <SimpleLineIcons name="options-vertical" size={10} color={colors.primary} />
                        </TouchableOpacity>
                    </Link>
            </TouchableOpacity>
        </Link>
    );

};

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        height: 70,
        backgroundColor: '#b8b8b81b',
        borderRadius: 20,
        padding: 10,
        gap: 10
    },
    image:{
        width: 50,
        height: 50,
        borderRadius: 10,
    },
    title_container: {
        flex:1,
        flexDirection: 'column'
    },
    title:{
        flex: 0.6,
        flexDirection: 'row',
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