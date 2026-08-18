import { Album, deleteAlbum, getAlbumById } from "@/db/AlbumsManager";
import { getSongCountByAlbumId } from "@/db/SongsAlbumsManager";
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
        return require('../../../res/def_cover.png');
    }
    return { uri: `${cover}?cache=${Date.now()}` };
}


export default function AlbumListItem (id: Id) {

    const [album, setAlbum] = useState<Album | null>(null);
    const [countSong, setCountSong] = useState<number>(0)


    useFocusEffect(
        useCallback(() => {
            async function loadInfo(){
                const result = await getAlbumById(id.id)
                if (result) {
                    setAlbum(result)
                    const cntSongs = await getSongCountByAlbumId(result.id)
                    if(cntSongs && cntSongs.count > 0) {
                        setCountSong(cntSongs.count)
                    }
                    else{
                        //Automaticly delete if nothing                        
                        await deleteAlbum(result)
                        setAlbum(null)
                    }
                };
            }
            loadInfo()
        }, [id.id])
    );
    if (!album){
        return null
    };

    return (
        <Link href={{
            pathname: "/Music/albumProfile",
            params: {id:[album.id.toString()]},
            }}
            push asChild>
            <TouchableOpacity style={styles.container}>
                <Image source={getCoverSource(album.cover)} style={styles.image}/>
                <View style={styles.title_container}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{album.name}</Text>
                    <Text style={styles.subtitle}>{countSong} songs</Text>
                </View>
                    <Link href={{
                        pathname: "/Music/albumSettings",
                        params: {id:[album.id.toString()]},
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