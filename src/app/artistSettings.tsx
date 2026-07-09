import SearchCoverModal from '@/components/SearchCoverModal';
import { File } from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Artist, deleteArtist, getArtistById, updateArtist } from '@/db/ArtistsManager';
import { deleteSongsByArtistId } from '@/db/SongsArtistsManager';
import { getSongById } from '@/db/SongsManager';
import { colors, globalStyles } from '@/styles/global';

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

async function saveChanges(artist:Artist, title: string, old_cover:File | null, new_cover:File | null){

    //update title
    artist.name = title
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
        
        artist.cover = uri
    }
    await updateArtist(artist)

    
}

async function deleteAction(artist:Artist){
    await deleteSongsByArtistId(artist.id)
    await deleteSongsByArtistId(artist.id)
    await deleteArtist(artist)
}
    
    //Check si l'artist existe
    //Si oui -> get by ID et ajouté sur la table S-Art
    //Sinon -> Add et

export default function artistSettings() {
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

    const [name, setName] = useState<string>("");
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
        let upArt = await getSongById(artist.id);
        if (upArt) {
            upArt.cover = newImage.uri
            setArtist(upArt);
            setNewCover(newImage)
            setCoverKey(Date.now());
        }
    }
    
    useEffect(() => {
        getArtistById(Number(params.id)).then(result => {
            if (result) {
                setArtist(result);
                setOldCover(new File(result.cover))
                setName(result.name)
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
                        saveChanges(artist, name, old_cover, new_cover)
                        router.back()
                    }} style={styles.btn_sm}>
                    <Text style={styles.btn_text}>Save</Text>
                </TouchableOpacity>
            </View>
            <ScrollView >
                <View style={styles.main_scroll}>
                    {getCoverSource(artist.cover, artist.name)}
                    <TouchableOpacity 
                        onPress={async () => {
                            openModal()
                        }} style={styles.btn_md}>
                        <Text style={styles.btn_text}>Change cover</Text>
                    </TouchableOpacity>
                    
                    <SearchCoverModal visible={visibleModal} onClose={closeModal} returnFileResult={updateCover} target='artist' id={artist.id} key={"song_setting:"+artist.id}/>
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
                    <TouchableOpacity 
                        onPress={async () => {
                            await deleteAction(artist)
                            router.dismissAll()
                        }} style={styles.btn_delete}>
                        <Text style={styles.btn_text}>Delete artist</Text>
                    </TouchableOpacity>
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
    btn_delete: {
        width: 150,
        height: 35,
        borderRadius: 20,
        backgroundColor: colors.danger,
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