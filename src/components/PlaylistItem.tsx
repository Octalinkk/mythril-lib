import { Playlist } from "@/db/PlaylistsManager";
import { getSongById } from "@/db/SongsManager";
import { colors } from "@/styles/global";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Id = {
  playlist_id: number;
};

function getCoverSource(cover: string) {
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: cover };
}

export default function PlaylistItem (id: Id) {

    const [playlist, setPlaylist] = useState<Playlist>({
        id: 0,
        name: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });

    useEffect(() => {
        getSongById(id.playlist_id).then(result => {
            if (result) setPlaylist(result);
        });
    }, []);


    return (
        <View style={styles.container}>
            <Image source={getCoverSource(playlist.cover)} style={styles.image}/>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{playlist.name}</Text>
            <Text style={styles.context}>2999 songs</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 200,
        backgroundColor: '#b8b8b81b',
        borderRadius: 20,
        padding: 10,
        paddingBottom: 5
    },
    image:{
        width: 130,
        height: 130,
        borderRadius: 20,
    },
    title_container: {
        flex:1,
    },
    title:{
        flex: 1,
        fontSize: 15,
        color: colors.primary,
        fontFamily: 'SpaceGrotesk_700Bold',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingRight: 5
    },
    context:{
        flex: 1,
        fontSize: 10,
        color: colors.secondary,
        fontFamily: 'SpaceGrotesk_700Bold',
        justifyContent: 'center',
        alignItems: 'center'
    }
});