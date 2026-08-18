import SearchCoverModal from '@/components/SearchCoverModal';
import { Directory, File, Paths } from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { Album, deleteAlbum, getAlbumById, getAlbumByName, updateAlbum } from '@/db/AlbumsManager';
import { deleteArtistsByAlbumId } from '@/db/ArtistsAlbumsManager';
import { addSongAlbum, deleteSongsByAlbumId, getSongsByAlbumId } from '@/db/SongsAlbumsManager';
import { colors, globalStyles } from '@/styles/global';

function getCoverSource(cover: string) {
    const file = new File(cover)
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: `${cover}?cache=${Date.now()}` };
}


async function saveChanges(album:Album, title: string, old_cover:File | null, new_cover:File | null){

    //update title
    album.name = title
    const alreadyAlb = await getAlbumByName(title)
    if (alreadyAlb != null && alreadyAlb.id != album.id){
        //IF already exist one like this
        const transfSongs = await getSongsByAlbumId(album.id)
        await Promise.all(transfSongs.map(id => addSongAlbum({
                song_id:id,
                album_id:alreadyAlb.id
            })));
        
        await deleteSongsByAlbumId(album.id)
        await deleteAlbum(album)
    }
    else {
        if(old_cover && new_cover){
            let uri = ""
            try{
                //image -> image
                const oldCovValue = old_cover.bytesSync()
                if (oldCovValue != new_cover.bytesSync()){
                    //nouvelle image
                    old_cover.delete()
                    const dir = new Directory(Paths.document, 'playlistCover');
                    const finalFile = new File(dir.uri + `/${album.id}_${Date.now()}.jpg`);
                    new_cover.moveSync(finalFile, { overwrite: true })
                    uri = new_cover.uri
                }
                else{
                    new_cover.delete()
                }
            }
            catch{
                new_cover.moveSync(new File(new_cover.uri.replace("-temp", `_${Date.now()}`)), { overwrite: true })
                uri = new_cover.uri
            }
            
            album.cover = uri
        }
        await updateAlbum(album)
    }
    
}

async function deleteAction(album:Album){
    await deleteSongsByAlbumId(album.id)
    await deleteArtistsByAlbumId(album.id)
    await deleteAlbum(album)
}

export default function albumSettings() {
    const params = useLocalSearchParams<{
        id: string;
    }>();

    const [album, setAlbum] = useState<Album>({
        id: 0,
        name: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });

    const [name, setName] = useState<string>("");
    const [visibleModal, setVisibleModal] = useState<boolean>(false)
    
    const [old_cover, setOldCover] = useState<File | null>(null);
    const [new_cover, setNewCover] = useState<File | null>(null);

    function openModal(){
        setVisibleModal(true)
    }

    function closeModal(){
        setVisibleModal(false)
    }
    
    async function updateCover(newImage:File) {
        let upAlb = await getAlbumById(album.id);
        if (upAlb) {
            upAlb.cover = newImage.uri
            setAlbum(upAlb);
            setNewCover(newImage)
        }
    }
    
    useEffect(() => {
        getAlbumById(Number(params.id)).then(result => {
            if (result) {
                setAlbum(result);
                setOldCover(new File(result.cover))
                setName(result.name)
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
                <TouchableOpacity 
                    onPress={async () => {
                        //Save change
                        await saveChanges(album, name, old_cover, new_cover)
                        router.back()
                    }} style={styles.btn_sm}>
                    <Text style={styles.btn_text}>Save</Text>
                </TouchableOpacity>
            </View>
            <ScrollView >
                <View style={styles.main_scroll}>
                    <Image source={getCoverSource(album.cover)} style={styles.cover}/>
                    <TouchableOpacity 
                        onPress={async () => {
                            openModal()
                        }} style={styles.btn_md}>
                        <Text style={styles.btn_text}>Change cover</Text>
                    </TouchableOpacity>
                    
                    <SearchCoverModal visible={visibleModal} onClose={closeModal} returnFileResult={updateCover} target='album' id={album.id} key={"song_setting:"+album.id}/>
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
                            await deleteAction(album)
                            router.dismissAll()
                        }} style={styles.btn_delete}>
                        <Text style={styles.btn_text}>Delete album</Text>
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