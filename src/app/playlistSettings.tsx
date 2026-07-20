import SearchCoverModal from '@/components/SearchCoverModal';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { File } from 'expo-file-system';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import SongListItem from '@/components/SongListItem';
import { deletePlaylist, getPlaylistById, Playlist, updatePlaylist } from '@/db/PlaylistsManager';
import { getSongById, Song } from '@/db/SongsManager';
import { addSongPlaylist, deleteSongsByPlaylistId, getSongsByPlaylistId } from '@/db/SongsPlaylistsManager';
import { colors, globalStyles } from '@/styles/global';

function getCoverSource(cover: string) {
    const file = new File(cover)
    if (!cover || cover =="") {
        return require('../res/def_cover.png');
    }
    return { uri: `${cover}?cache=${Date.now()}` };
}




async function saveChanges(playlist:Playlist, songs:Song[], title: string, old_cover:File | null, new_cover:File | null){

    //update title
    playlist.name = title
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
        
        playlist.cover = uri
    }
    await updatePlaylist(playlist)

    try{
        await deleteSongsByPlaylistId(playlist.id)
    }
    catch{
        console.log("Couldn't delete link for song")
    }

    for (const song of songs){
        if (song != null && song != undefined){
            await addSongPlaylist({
                song_id:song.id,
                playlist_id:playlist.id
            })
        }
    }
}

async function deleteAction(playlist:Playlist){
    await deleteSongsByPlaylistId(playlist.id)
    await deletePlaylist(playlist)
}

export default function playlistSettings() {
    const params = useLocalSearchParams<{
        id: string;
    }>();

    const [playlist, setPlaylist] = useState<Playlist>({
        id: 0,
        name: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });

    const [songs, setSongs] = useState<Song[]>([]) 

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

    function loadItemsList(){
        if (songs.length === 0) {
            return <View></View>;
        }
        
        return songs.map(song => (
            
            <View style={styles.list_item} key={"delete_song:"+song.id}>
                <SongListItem song_id={song.id} play_ids={[song.id]}/>
                <TouchableOpacity style={styles.delete} onPress={() => removeSongFromList(song)}>
                    <FontAwesome5 name="trash-alt" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        ));
    }

    function removeSongFromList(song:Song){
        let upSong:Song[] = songs.map(song => song)
        const idx = upSong.indexOf(song)
        if (idx > -1) {
            upSong.splice(idx, 1)
        }
        setSongs(upSong)
    }
    
    async function updateCover(newImage:File) {
        let upPlay = await getPlaylistById(playlist.id);
        if (upPlay) {
            upPlay.cover = newImage.uri
            setPlaylist(upPlay);
            setNewCover(newImage)
        }
    }
    
    useFocusEffect(
        useCallback(() => {
            async function loadInfo(){
                const result = await getPlaylistById(Number(params.id))
                if (result) {
                    setPlaylist(result);
                    setOldCover(new File(result.cover))
                    setName(result.name)
                    const songsIds = await Promise.resolve(
                        getSongsByPlaylistId(result.id)
                    );
                    const songs = await Promise.all(
                        songsIds.map(id => getSongById(+id))
                    );
                    setSongs(songs.filter((song): song is Song => song !== null))
                }
            }
            loadInfo()
        }, [params.id])
    );
    if (!playlist) return null;
    

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
                        await saveChanges(playlist, songs, name, old_cover, new_cover)
                        router.back()
                    }} style={styles.btn_sm}>
                    <Text style={styles.btn_text}>Save</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={{marginBottom: 50}}>
                <View style={styles.main_scroll}>
                    <Image source={getCoverSource(playlist.cover)} style={styles.cover}/>
                    <TouchableOpacity 
                        onPress={async () => {
                            openModal()
                        }} style={styles.btn_md}>
                        <Text style={styles.btn_text}>Change cover</Text>
                    </TouchableOpacity>
                    
                    <SearchCoverModal visible={visibleModal} onClose={closeModal} returnFileResult={updateCover} target='playlist' id={playlist.id} key={"playlist_setting:"+playlist.id}/>
                    <View style={styles.field_container}>
                        <Text style={styles.field_title}>Name</Text>
                        <TextInput
                            style={styles.field_input}
                            onChangeText={(name) => setName(name)}
                            inputMode='text'
                            value={name}
                            placeholder="Playlist name"
                            placeholderTextColor ={colors.secondary}
                        />
                    </View>
                    <TouchableOpacity 
                        onPress={async () => {
                            await deleteAction(playlist)
                            router.dismissAll()
                        }} style={styles.btn_delete}>
                        <Text style={styles.btn_text}>Delete playlist</Text>
                    </TouchableOpacity>
                </View>
                {loadItemsList()}
                
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
    },
    list_item:{
        flex:1,
        flexDirection: 'row',
        maxHeight: 80,   
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        padding: 20
    },
    delete:{
        flex:0.2,
        height: 60,  
        width: 60,  
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.danger
    }

});