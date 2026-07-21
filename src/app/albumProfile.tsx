import Header from '@/components/Header';
import { File } from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import ArtistItem from '@/components/ArtistItem';
import SongListItem from '@/components/SongListItem';
import { Album, getAlbumById, updateAlbum } from '@/db/AlbumsManager';
import { getArtistsByAlbumId } from '@/db/ArtistsAlbumsManager';
import { Artist, getArtistById } from '@/db/ArtistsManager';
import { getSongCountByAlbumId, getSongsByAlbumId } from '@/db/SongsAlbumsManager';
import { getSongById, Song } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';
import { SimpleLineIcons } from '@expo/vector-icons';


function getCoverSource(cover: string) {
    const file = new File(cover)
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: `${cover}?cache=${Date.now()}` };
}

async function updateAlbumStats(album:Album){
    album.time_started += 1
    album.last_time_played = new Date().toISOString()
    await updateAlbum(album) 
}

function getSongsList(album:Album, songs:Song[]){
    if (songs.length > 0){
        return songs.map(song => <SongListItem song_id={song.id} play_ids={[]} onLinkClick={() => updateAlbumStats(album)} key={"listed_song:"+song.id}/>)
    }
    else{
        return <Text style={styles.filler_text}>None located for this album</Text>
    }
}

function getArtistList(artists:Artist[]){
    let recentArtist = []
    
      if (artists.length > 0){
        for (const item of artists) {
            recentArtist.push(<ArtistItem artist_id={item.id} key={"artist:"+item.id}/>)
        }
      }
      else {
        recentArtist.push(<Text style={styles.filler_text}  key={"artist:None"}>No Artists found</Text>)
      }
      return recentArtist
}

async function getSongsforAlbumId(id:number){
    const songsIds = await Promise.resolve(
        getSongsByAlbumId(id)
    );
    const songs = await Promise.all(
        songsIds.map(id => getSongById(+id))
    );
    return songs.filter((song): song is Song => song !== null);
}

async function getArtistsforAlbumId(id:number){
    const artistsIds = await Promise.resolve(
        getArtistsByAlbumId(id)
    );
    const artists = await Promise.all(
        artistsIds.map(id => getArtistById(+id))
    );
    return artists.filter((artist): artist is Artist => artist !== null);
}

export default function AlbumProfil() {
    const params = useLocalSearchParams<{
        id: string;
    }>();

    const [album, setAlbum] = useState<Artist>({
        id: 0,
        name: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });
    const [songs, setSongs] = useState<Song[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [countSong, setCountSong] = useState<number>(0)

    useFocusEffect(
        useCallback(() => {
            getAlbumById(Number(params.id)).then(result => {
                if (result) {
                    setAlbum(result)
                    getSongCountByAlbumId(result.id).then(cntSong => {
                        if (cntSong) setCountSong(cntSong.count);
                    });
                    getSongsforAlbumId(result.id).then(songs => {
                        setSongs(songs)
                    })
                    getArtistsforAlbumId(result.id).then(albums => {
                        setArtists(albums)
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
                        pathname: "/albumSettings",
                        params: {id:[album.id.toString()]},
                        }} push asChild>
                        <TouchableOpacity>
                            <SimpleLineIcons name="options-vertical" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </Link>
                </View>
                <View style={styles.main_scroll}>
                    <View style={styles.pfp_container}>
                        <Image source={getCoverSource(album.cover)} style={styles.cover}/>
                    </View>        
                    <Text style={styles.name}>{album.name}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.context}>{countSong} songs</Text>
                    <Text style={styles.title}>Made by : </Text>
                    <View style={styles.items_container_md} >
                        {getArtistList(artists)}
                    </View>
                    <Text style={styles.title}>Songs</Text>
                    {getSongsList(album, songs)}
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
    cover: {
        flex: 1,
        width: 200,
        height: 200,
        borderRadius: 30
    },
    items_container_md: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 30, 
        justifyContent: 'space-between', 
        gap: 20,
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