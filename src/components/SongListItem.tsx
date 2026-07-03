import { Artist, getArtistById } from "@/db/ArtistsManager";
import { getArtistsBySongId } from "@/db/SongsArtistsManager";
import { getSongById, Song, updateSong } from "@/db/SongsManager";
import { colors } from "@/styles/global";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Link } from "expo-router";
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

function getArtistName(artists: Artist[]):string {
    if (artists.length >= 1) {
        return artists.map(artist => artist.name).join(' | ');
    }
    else return "unknown"
}

export default function SongListItem (id: Id) {

    const [song, setSong] = useState<Song>({
        id: 0,
        name: "",
        file_path: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });

    const [artists, setArtists] = useState<Artist[]>([])

    useEffect(() => {

        async function getArtistsforSongId(songId:number){
            const artistsIds = await Promise.resolve(
                getArtistsBySongId(songId)
            );
                    const artists = await Promise.all(
                artistsIds.map(id => getArtistById(+id))
            );
            return artists.filter((artist): artist is Artist => artist !== null);
        }

        

        async function setArtistsDisplay(songId:number){
            const artists = await getArtistsforSongId(songId)
            setArtists(artists)
        }

        getSongById(id.song_id).then(result => {
            if (result) {
                setSong(result);
                setArtistsDisplay(result.id)
            }
        });
    }, []);


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
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{song.name}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.subtitle}>{getArtistName(artists)}</Text>
                </View>
                    <Link href={{
                        pathname: "/songSettings",
                        params: {id:[song.id.toString()]},
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
        fontSize: 20,
        color: colors.primary,
        fontFamily: 'SpaceGrotesk_700Bold',
        alignItems: 'center'
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