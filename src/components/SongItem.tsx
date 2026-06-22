import { getSongById, Song } from "@/db/SongsManager";
import { colors } from "@/styles/global";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

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



    console.log(song.cover)

    return (
        <View style={styles.container}>
            <Image source={getCoverSource(song.cover)} style={styles.image}/>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{song.name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        width: 150,
        height: 200,
        backgroundColor: '#b8b8b81b',
        borderRadius: 20,
        padding: 10,
        gap: 10
    },
    image:{
        width: 130,
        height: 130,
        borderRadius: 20,
    },
    title:{
        flex: 1,
        flexDirection: 'row',
        fontSize: 15,
        color: colors.primary,
        fontFamily: 'SpaceGrotesk_700Bold',
        flexWrap: 'wrap'  
    }
});