import { getSongById, Song } from "@/db/SongsManager";
import { colors } from "@/styles/global";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Id = {
  song_id: number;
};

function getCoverSource(cover: string) {
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: cover };
}

export default function SongItem (id: Id) {

    const [song, setSong] = useState<Song>({
        id: 0,
        name: "",
        file_path: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });

    useEffect(() => {
        getSongById(id.song_id).then(result => {
            if (result) setSong(result);
        });
    }, []);


    return (
        <View style={styles.container}>
            <Image source={getCoverSource(song.cover)} style={styles.image}/>
            <View style={styles.title_container}>
                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{song.name}</Text>
                <TouchableOpacity style={styles.icon}>
                    <SimpleLineIcons name="options-vertical" size={10} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

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