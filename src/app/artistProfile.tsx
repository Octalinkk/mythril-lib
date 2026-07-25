import Header from '@/components/Header';
import { File } from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import AlbumListItem from '@/components/AlbumListItem';
import SongListItem from '@/components/SongListItem';
import { Album, getAlbumById } from '@/db/AlbumsManager';
import { getAlbumCountById, getAlbumsByArtistId } from '@/db/ArtistsAlbumsManager';
import { Artist, getArtistById, updateArtist } from '@/db/ArtistsManager';
import { getSongCountByArtistId, getSongsByArtistId } from '@/db/SongsArtistsManager';
import { getSongById, Song } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';
import { SimpleLineIcons } from '@expo/vector-icons';


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


async function updateArtistStats(artist:Artist){
    artist.time_started += 1
    artist.last_time_played = new Date().toISOString()
    await updateArtist(artist) 
}

function getSongsList(artist:Artist, songs:Song[]){
    if (songs.length > 0){
        return songs.map(song => <SongListItem song_id={song.id} play_ids={[]} onLinkClick={async () => await updateArtistStats(artist)} key={"listed_song:"+song.id}/>)
    }
    else{
        return <Text style={styles.filler_text}>None located for this artist</Text>
    }
}

function getAlbumsList(albums:Album[]){
    if (albums.length > 0){
        //Faire les display pour les albums
        return albums.map(album => <AlbumListItem id={album.id} key={"listed_album:"+album.id}/>)
    }
    else{
        return <Text style={styles.filler_text}>None located for this artist</Text>
    }
}

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

async function getSongsforArtistId(id:number){
    const songsIds = await Promise.resolve(
        getSongsByArtistId(id)
    );
    const songs = await Promise.all(
        songsIds.map(id => getSongById(+id))
    );
    return songs.filter((song): song is Song => song !== null);
}

async function getAlbumsforArtistId(id:number){
    const albumsIds = await Promise.resolve(
        getAlbumsByArtistId(id)
    );
    const albums = await Promise.all(
        albumsIds.map(id => getAlbumById(+id))
    );
    return albums.filter((album): album is Album => album !== null);
}

export default function ArtistProfil() {
    const params = useLocalSearchParams<{
        id: string;
    }>();

    const [artist, setArtist] = useState<Artist>({
        id: 0,
        name: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });
    const [songs, setSongs] = useState<Song[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [countSong, setCountSong] = useState<number>(0)
    const [countAlbum, setCountAlbum] = useState<number>(0)

    useFocusEffect(
        useCallback(() => {
            getArtistById(Number(params.id)).then(result => {
                if (result) {
                    setArtist(result)
                    getSongCountByArtistId(result.id).then(cntSong => {
                        if (cntSong) setCountSong(cntSong.count);
                    });
                    getAlbumCountById(result.id).then(cntAlb => {
                        if (cntAlb) setCountAlbum(cntAlb.count);
                    });
                    getSongsforArtistId(result.id).then(songs => {
                        setSongs(songs)
                    })
                    getAlbumsforArtistId(result.id).then(albums => {
                        setAlbums(albums)
                    })
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
                        pathname: "/artistSettings",
                        params: {id:[artist.id.toString()]},
                        }} push asChild>
                        <TouchableOpacity>
                            <SimpleLineIcons name="options-vertical" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </Link>
                </View>
                <View style={styles.main_scroll}>
                    <View style={styles.pfp_container}>
                        {getCoverSource(artist.cover, artist.name)}
                    </View>        
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>{artist.name}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.context}>{countSong} songs | {countAlbum} albums</Text>
                    <Text style={styles.title}>Songs</Text>
                    {getSongsList(artist, songs)}
                    <Text style={styles.title}>Albums</Text>
                    {getAlbumsList(albums)}
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
    pfp_container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    image:{
        width: 200,
        height: 200,
        borderRadius: 200 / 2,
        overflow: "hidden",
    },
    profile_container:{
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%'
    },
    profile_title:{
        fontSize: 80,
        marginBottom:5,
        color: colors.primary,
        fontFamily: 'SpaceGrotesk_700Bold',
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
        textAlign: 'center',
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