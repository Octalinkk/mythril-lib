import SearchCoverModal from '@/components/SearchCoverModal';
import { File } from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { addArtist, getArtistById, getArtistByName } from '@/db/ArtistsManager';
import { addSongArtist, deleteArtistsBySongId, getArtistsBySongId } from '@/db/SongsArtistsManager';
import { getSongById, Song, updateSong } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';

function getCoverSource(cover: string, key:number) {
    const file = new File(cover)
    if (!cover || cover =="" || !file.exists) {
        return require('../res/def_cover.png');
    }
    return { uri: `${cover}?cache=${key}` };
}

async function saveChanges(song:Song, title: string, artist: string, album: string, old_cover:File | null, new_cover:File | null){

    //update title
    song.name = title
    if(old_cover && new_cover){
        let uri = ""
        try{
            const oldCovValue = old_cover.bytesSync()
            if (oldCovValue != new_cover.bytesSync()){
                //nouvelle image
                uri = old_cover.uri
                new_cover.moveSync(old_cover, { overwrite: true })
            }
            else{
                new_cover.delete()
            }
        }
        catch{
            new_cover.moveSync(new File(new_cover.uri.replace("-temp", "")), { overwrite: true })
            uri = new_cover.uri
        }
        
        song.cover = uri
    }
    await updateSong(song)

    //update artist(s)
    //Delete tout les registre de la relationel Song-Artist by Song id
    try{
        await deleteArtistsBySongId(song.id)
    }
    catch{
        console.log("Couldn't delete link for song")
    }
    const artistLst = artist.split(",").map(art => art.trimStart());
    for (const [index, artName] of artistLst.entries()){
        const artist = await getArtistByName(artName)
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
        }
        else {id = artist.id}        
            
        
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
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    const [coverKey, setCoverKey] = useState<number>(Date.now());
    
    const [old_cover, setOldCover] = useState<File | null>(null);
    const [new_cover, setNewCover] = useState<File | null>(null);

    function openModal(){
        setVisibleModal(true)
    }

    function closeModal(){
        setVisibleModal(false)
    }
    
    async function updateCover(newImage:File) {
        let upSong = await getSongById(song.id);
        if (upSong) {
            upSong.cover = newImage.uri
            setSong(upSong);
            setNewCover(newImage)
            setCoverKey(Date.now());
        }
    }
    
    useEffect(() => {
        getSongById(Number(params.id)).then(result => {
            if (result) {
                setSong(result);
                setOldCover(new File(result.cover))
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
        //TODO update pour que l'image soit mise à jour
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
                        saveChanges(song, name, artist, album, old_cover, new_cover)
                        router.back()
                    }} style={styles.btn_sm}>
                    <Text style={styles.btn_text}>Save</Text>
                </TouchableOpacity>
            </View>
            <ScrollView >
                <View style={styles.main_scroll}>
                    <Image source={getCoverSource(song.cover, coverKey)} style={styles.cover}/>
                    <TouchableOpacity 
                        onPress={async () => {
                            openModal()
                        }} style={styles.btn_md}>
                        <Text style={styles.btn_text}>Change cover</Text>
                    </TouchableOpacity>
                    
                    <SearchCoverModal visible={visibleModal} onClose={closeModal} returnFileResult={updateCover} target='song' id={song.id} key={"song_setting:"+song.id}/>
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