import { LinearGradient } from 'expo-linear-gradient';
import { Suspense, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import AlbumListItem from '@/components/AlbumListItem';
import ArtistListItem from '@/components/ArtistListItem';
import SongListItem from '@/components/SongListItem';
import { Album, getAllAlbums } from '@/db/AlbumsManager';
import { Artist, getAllArtists } from '@/db/ArtistsManager';
import { getAllSongs, Song } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';

function getFilteredSongList(songs: Song[], filter:string){
    const filteredSongs = songs.filter((song) => song.name.toLowerCase().includes(filter.toLowerCase()))
    if (filteredSongs.length <= 0){return <Text style={styles.filler_text}>None found</Text>}
    if (filteredSongs.length > 10){return filteredSongs.slice(0, 10).map(song => <SongListItem song_id={song.id} play_ids={[]} key={"searched_song:"+song.id}/>)}
    else{return filteredSongs.map(song => <SongListItem song_id={song.id} play_ids={[]} key={"searched_song:"+song.id}/>)}
    
}

function getFilteredArtistList(artists: Artist[], filter:string){
    const filteredArtists = artists.filter((artist) => artist.name.toLowerCase().includes(filter.toLowerCase()))
    if (filteredArtists.length <= 0){return <Text style={styles.filler_text}>None found</Text>}
    if (filteredArtists.length > 10){return filteredArtists.slice(0, 10).map(artist => <ArtistListItem artist_id={artist.id} key={"searched_artist:"+artist.id}/>)}
    else{return filteredArtists.map(artist => <ArtistListItem artist_id={artist.id} key={"searched_artist:"+artist.id}/>)}
    
}

function getFilteredAlbumList(albums: Album[], filter:string){
    const filteredAlbums = albums.filter((album) => album.name.toLowerCase().includes(filter.toLowerCase()))
    if (filteredAlbums.length <= 0){return <Text style={styles.filler_text}>None found</Text>}
    if (filteredAlbums.length > 10){return filteredAlbums.slice(0, 10).map(album => <AlbumListItem id={album.id} key={"searched_album:"+album.id}/>)}
    else{return filteredAlbums.map(album => <AlbumListItem id={album.id} key={"searched_album:"+album.id}/>)}
    
}

export default function SearchScreen() {


    const [name, setName] = useState<string>("");
    const [songs, setAllSongs] = useState<Song[]>([]);
    const [artists, setAllArtists] = useState<Artist[]>([]);
    const [albums, setAllAlbums] = useState<Artist[]>([]);
    
    
    
    useEffect(() => {
        getAllSongs().then(result => {
            if (result) {
                setAllSongs(result);
            }
        });

        getAllArtists().then(result => {
            if (result) {
                setAllArtists(result);
            }
        });

        getAllAlbums().then(result => {
            if (result) {
                setAllAlbums(result);
            }
        });
    }, []);
    

    return (
        <LinearGradient 
        
              style={globalStyles.main_container}
              colors={[colors.grad_prim, colors.grad_sec, colors.grad_tri]}
              start={{x:0, y:0}}
              end={{x:1, y:1}}
            >
            <View style={styles.main_container}>
                <View style={styles.header}>
                    <TextInput
                        style={styles.search_input}
                        onChangeText={(text) => setName(text)}
                        inputMode='text'
                        placeholder="Search: Songs, Artists or Albums"
                        placeholderTextColor ={colors.secondary}
                    />
                </View>
                <ScrollView >
                    <View style={styles.main_scroll}>
                        <Text style={styles.title}>Songs</Text>
                        <Suspense fallback={<Text style={{backgroundColor: 'red'}}>Loading...</Text>}>
                            {getFilteredSongList(songs, name)}
                        </Suspense>
                        <Text style={styles.title}>Artists</Text>
                        <Suspense fallback={<Text style={{backgroundColor: 'red'}}>Loading...</Text>}>
                            {getFilteredArtistList(artists, name)}
                        </Suspense>
                        <Text style={styles.title}>Albums</Text>
                        <Suspense fallback={<Text style={{backgroundColor: 'red'}}>Loading...</Text>}>
                            {getFilteredAlbumList(albums, name)}
                        </Suspense>
                    </View>
                </ScrollView>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({  
    main_container: {
        flex: 1,
        marginBottom: 50
    },
    header: {
        flex: 1,
        flexDirection: 'row',
        maxHeight: 40,
        alignItems: 'center',
        marginVertical: 20
    },
    search_input: {
        flex:1,
        backgroundColor: '#4646467c',
        color: colors.primary,
        height: 40,
        marginHorizontal: 20,
        paddingHorizontal: 20,
        borderRadius: 20,
        borderColor: colors.primary,
        borderWidth: 1
    },
    title: {
        flex: 1,
        fontSize: 30,
        fontFamily: 'SpaceGrotesk_700Bold',
        textAlign: 'left',
        color: colors.primary
    },
    btn_sm: {
        width: 70,
        height: 35,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center', 
        marginRight: 20
    },
    btn_md: {
        width: 150,
        height: 35,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center', 
    },
    btn_text: {
        fontFamily: 'SpaceGrotesk_400Regular',
        fontSize: 15,
        textAlign: 'center',  
        textAlignVertical: 'center', // ← centre le texte lui-même
    },
    main_scroll: {
        paddingVertical: 30,
        gap: 10,
        paddingHorizontal: 20,
        alignItems: 'center', 
    },
    cover: {
        flex: 1,
        width: 200,
        height: 200,
        borderRadius: 30
    },
    filler_text: {
        flex: 1,
        color: colors.secondary,
        fontFamily: 'SpaceGrotesk_400Regular',
    },
    field_container:{
        flex: 1,
        width: '100%',
    },
    field_title:{
        flex: 1,
        flexDirection: 'row',
        fontFamily: 'SpaceGrotesk_400Regular',
        fontSize: 15,
        color: colors.primary
    },
    field_input:{
        flex: 1,
        fontFamily: 'SpaceGrotesk_400Regular',
        fontSize: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
        color: colors.primary
    }

});