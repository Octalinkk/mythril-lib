import { LinearGradient } from 'expo-linear-gradient';
import { Suspense, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import SongListItem from '@/components/SongListItem';
import { getAllSongs, Song } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';

function getFilteredSongList(songs: Song[], filter:string){
    const filteredSongs = songs.filter((song) => song.name.toLowerCase().includes(filter.toLowerCase()))
    console.log(filteredSongs.length)
    return filteredSongs.map(song => <SongListItem song_id={song.id} key={"searched_song:"+song.id}/>)
}

export default function SearchSongsScreen() {


    const [name, setName] = useState<string>("");
    const [songs, setAllSongs] = useState<Song[]>([]);
    
    
    
    useEffect(() => {
        getAllSongs().then(result => {
            if (result) {
                setAllSongs(result);
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
            <View style={styles.header}>
                <TextInput
                    style={styles.search_input}
                    onChangeText={(text) => setName(text)}
                    inputMode='text'
                    placeholder="Search Songs, Artists or Albums"
                    placeholderTextColor ={colors.secondary}
                />
            </View>
            <ScrollView >
                <View style={styles.main_scroll}>
                    <Suspense fallback={<Text style={{backgroundColor: 'red'}}>Loading...</Text>}>
                        {getFilteredSongList(songs, name)}
                    </Suspense>
                    
                </View>
            </ScrollView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({  
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