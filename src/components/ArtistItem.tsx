import { getAlbumCountById } from "@/db/ArtistsAlbumsManager";
import { Artist, getArtistById } from "@/db/ArtistsManager";
import { getSongCountById } from "@/db/SongsArtistsManager";
import { colors } from "@/styles/global";
import { File } from "expo-file-system";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Id = {
  artist_id: number;
};

function getRandomColor(seed:string){
    if(seed){
        const codeA = (seed[0].toUpperCase().charCodeAt(0) - 64)
        const codeB = (seed[1].toUpperCase().charCodeAt(0) - 64)
        const diff = Math.abs(codeA - codeB)
        const r = codeA*10 > 255 ? 255 : Math.round(codeA*10)
        const g = codeB*10 > 255 ? 255 : Math.round(codeB*10)
        const b = diff*10 > 255 ? 255 : Math.round(diff*10)
        return `rgba(${r}, ${g}, ${b},1)`
    }
    return "#000000"
    
}

function getCoverSource(cover: string, name:string) {
    const file = new File(cover)
    if (!cover || cover =="" || !file.exists) {
        const split = name.split(" ")
        let text = ""
        if(split.length > 1){
            text = split.map(name => name.charAt(0).toUpperCase()).join("").substring(0, 2)
        }
        else{
            text = split[0].substring(0, 2).toUpperCase()
        }

        return (<View style={[{backgroundColor: getRandomColor(text)}, styles.profile_container]}>
                    <Text style={styles.profile_title}>{text}</Text>
                </View>)
    }
    return <Image source={{uri: `${cover}?cache=${Date.now()}`}} style={styles.image}/>
}


export default function ArtistItem (id: Id) {

    const [artist, setArtist] = useState<Artist>({
        id: 0,
        name: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });
    const [countSong, setCountSong] = useState<number>(0)
    const [countAlbum, setCountAlbum] = useState<number>(0)

    useEffect(() => {
        getArtistById(id.artist_id).then(result => {
            if (result) setArtist(result);
            getSongCountById(id.artist_id).then(cntSong => {
                if (cntSong) setCountSong(cntSong.count);

            });
            getAlbumCountById(id.artist_id).then(cntAlb => {
                if (cntAlb) setCountAlbum(cntAlb.count);

            });
        });
    }, [id]);

        return (
            <View style={styles.container}>
                {getCoverSource(artist.cover, artist.name)}
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{artist.name}</Text>
                <Text style={styles.context}>{countSong} songs | {countAlbum} albums</Text>
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
        borderRadius: '50%',
    },
    profile_container:{
        width: 130,
        height: 130,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%'
    },
    profile_title:{
        fontSize: 50,
        color: colors.primary,
        fontFamily: 'SpaceGrotesk_700Bold',
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