import { getSongById, Song, updateSong } from "@/db/SongsManager";
import { colors } from "@/styles/global";
import { SimpleLineIcons } from "@expo/vector-icons";
import { File } from "expo-file-system";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SongSettingsModal from "./songSettingsModal";


type Id = {
  song_id: number;
};

function getCoverSource(cover: string) {
    const file = new File(cover)
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: `${cover}?cache=${Date.now()}` };
}

export default function SongItem (id: Id) {

    const [song, setSong] = useState<Song | null>(null);
    const [visibleModal, setVisibleModal] = useState<boolean>(false)

    useFocusEffect(
        useCallback(() => {
            getSongById(id.song_id).then(result => {
                if (result) setSong(result);
            });
        }, [id.song_id])
    );

    if (!song) return null;

    

    
    function openModal(){
        setVisibleModal(true)
    }

    function closeModal(){
        setVisibleModal(false)
    }

    return (
        <Link href={{
            pathname: "/musicPlayer",
            params: {ids:[song.id.toString()]},
            }}
            onPress={async () => {
                song.time_started += 1
                song.last_time_played = new Date().toISOString()
                await updateSong(song)
            }} push asChild>
            <TouchableOpacity style={styles.container}>
                <Image source={getCoverSource(song.cover)} style={styles.image}/>
                <View style={styles.title_container}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={styles.title}>{song.name}</Text>
                    <TouchableOpacity style={styles.icon} onPress={openModal}>
                        <SimpleLineIcons name="options-vertical" size={12} color={colors.primary} />
                    </TouchableOpacity>
                    <SongSettingsModal visible={visibleModal} onClose={closeModal} id={song.id}/>
                </View>
            </TouchableOpacity>
        </Link>
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
        flex: 0.3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});