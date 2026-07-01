import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { addArtist, getArtistById, getArtistByName } from '@/db/ArtistsManager';
import { addSongArtist, deleteArtistsBySongId, getArtistsBySongId } from '@/db/SongsArtistsManager';
import { getSongById, Song } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';

function getCoverSource(cover: string) {
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: cover };
}

async function saveChanges(song:Song, title: string, artist: string, album: string){

    //update title
    song.name = title


    //update artist(s)
    //Delete tout les registre de la relationel Song-Artist by Song id
    try{
        await deleteArtistsBySongId(song.id)
    }
    catch{
        console.log("Couldn't delete link for song")
    }
    const artistLst = artist.split(",").map(art => art.trimStart());
    console.log(artistLst)
    for (const [index, artName] of artistLst.entries()){
        console.log(artName)
        const artist = await getArtistByName(artName)
        console.log(artist)
        let id = 0
        if (!artist){
            const newArtist = {
                id: 0,
                name: artName,
                cover: "",
                last_time_played: "",
                time_listened: 0,
                time_started: 0
            }
            id = await addArtist(newArtist)            
            console.log("newID", id)
        }
        else {console.log("existingId", artist.id) 
            id = artist.id}        
            
        
        await addSongArtist({
            song_id:song.id,
            artist_id:id
        })
    }
    
    //Check si l'artist existe
    //Si oui -> get by ID et ajouté sur la table S-Art
    //Sinon -> Add et
}

export default function MusicPlayer() {
    const params = useLocalSearchParams<{
        id: string;
    }>();

    const [song, setSong] = useState<Song>({
        id: 0,
        name: "",
        file_path: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });

    const [name, setName] = useState<string>("");
    const [artist, setArtist] = useState<string>("");
    const [album, setAlbum] = useState<string>("");
    
    
    
    useEffect(() => {
        getSongById(Number(params.id)).then(result => {
            if (result) {
                setSong(result);
                setName(result.name)
                getArtistsBySongId(Number(result.id)).then(artIds => {
                    if (artIds) {
                        const artistsProm = artIds.map(id => getArtistById(id))
                        Promise.all(artistsProm).then(artists => {
                           setArtist(artists.map(art => art?.name ?? "").join(", "))
                        })
                    }
                    else{
                        setArtist("Nada")
                    }
                });
            }
        });

        //Load current artist if any
        //Load current album if any
    }, []);
    

    return (
        <LinearGradient 
              style={globalStyles.main_container}
              colors={[colors.grad_prim, colors.grad_sec, colors.grad_tri]}
              start={{x:0, y:0}}
              end={{x:1, y:1}}
            >
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={async () => {
                        //Save change
                        saveChanges(song, name, artist, album)
                        router.back()
                    }} style={styles.btn_sm}>
                    <Text style={styles.btn_text}>Save</Text>
                </TouchableOpacity>
            </View>
            <ScrollView >
                <View style={styles.main_scroll}>
                    <Image source={getCoverSource(song.cover)} style={styles.cover}/>
                    <TouchableOpacity 
                        onPress={async () => {
                            //Change cover popup (modal je crois)
                        }} style={styles.btn_md}>
                        <Text style={styles.btn_text}>Change cover</Text>
                    </TouchableOpacity>
                    <View style={styles.field_container}>
                        <Text style={styles.field_title}>Title</Text>
                        <TextInput
                            style={styles.field_input}
                            onChangeText={(name) => setName(name)}
                            inputMode='text'
                            value={name}
                            placeholder="Song title"
                            placeholderTextColor ={colors.secondary}
                        />
                    </View>

                    <View style={styles.field_container}>
                        <Text style={styles.field_title}>Artist</Text>
                        <TextInput
                            style={styles.field_input}
                            onChangeText={(artist) => setArtist(artist)}
                            inputMode='text'
                            value={artist}
                            placeholder="Artist name"
                            placeholderTextColor ={colors.secondary}
                        />
                    </View>

                    <View style={styles.field_container}>
                        <Text style={styles.field_title}>Album</Text>
                        <TextInput
                            style={styles.field_input}
                            onChangeText={(album) => setAlbum(album)}
                            inputMode='text'
                            value={album}
                            placeholder="Album title"
                            placeholderTextColor ={colors.secondary}
                        />
                    </View>
                </View>
                
                
            </ScrollView>
            <Text>{song.name}</Text>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({  
    header: {
        flex: 1,
        flexDirection: 'row-reverse',
        maxHeight: 40,
        alignItems: 'center',
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
        gap: 20,
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