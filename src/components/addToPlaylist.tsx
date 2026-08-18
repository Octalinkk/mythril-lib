import { getAllCustomPlaylists, Playlist } from "@/db/PlaylistsManager";
import { getSongById, Song } from "@/db/SongsManager";
import { addSongPlaylist, deletePlaylistsBySongId, getPlaylistsBySongId } from "@/db/SongsPlaylistsManager";
import { colors } from "@/styles/global";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PlaylistListItem from "./PlaylistListItem";
import CreatPlaylistModal from "./addPlaylist";
import CheckBox from "./checkbox";


type addToPlaylistModalProps = {
    visible: boolean;
    onClose: () => void;
    id: number;
};


export default function AddToPlaylistModal ({ visible, onClose, id }: addToPlaylistModalProps) {

    

    const [song, setSong] = useState<Song>({
        id: 0,
        name: "",
        file_path: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });

    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    const [stats, updateStats] = useState<Map<number, boolean>>(new Map());


    const [oldSelectedId, setOldSelectedId] = useState<number[]>([]);


    const [visibleModal, setVisibleModal] = useState<boolean>(false)

    useEffect(() => {
        
    }, []);

    useFocusEffect(
        useCallback(() => {
            getSongById(id).then(result => {
                if (result) {
                    setSong(result)
                }
            });

            getAllCustomPlaylists().then(resPlst => {
                if (resPlst) {
                    setPlaylists(resPlst)
                    getPlaylistsBySongId(id).then(result => {
                        if (result) {
                            resPlst.forEach(playlist => {
                                if (result.length != 0 && result.includes(playlist.id)){
                                    setState(playlist.id, true)
                                }
                                else{setState(playlist.id, false)}
                            })
                        }
                    });
                }
                
            });

            
        }, [])
    );

    function loadItemsCheck(){
        if (playlists.length === 0) {
            return <Text>None found</Text>;
        }
        
        return playlists.map(playlist => (            
            <TouchableOpacity style={styles.check_item} onPress={() => switchState(playlist.id)} key={"checkbox_item:"+playlist.id}>
                <View style={{flex:0.2}}><CheckBox value={getStat(playlist.id)}/></View>
                <View style={{flex:0.9}}><PlaylistListItem id={playlist.id} displayOnly={true} isLocked={true}/></View>                
            </TouchableOpacity>
        ));
    }

    async function savechanges(){
        await deletePlaylistsBySongId(song.id)
        const playlistIds = Array.from(stats.entries()).filter(([id, value]) => value == true).map(([id]) => id);
        await Promise.all(
            playlistIds.map(id => addSongPlaylist({
                song_id:song.id,
                playlist_id:id
            }))
        );
        //Keep song in "All Songs" playlist
        await addSongPlaylist({song_id:song.id,playlist_id:1})
        onClose()
    }
    
    function openModal(){
        setVisibleModal(true)
    }

    function closeModal(){
        setVisibleModal(false)
    }

    function getStat(id: number): boolean {
        if (stats) {
            const value = stats.get(id);
            if (value !== undefined) {
                return value;
            }
        }
        return false;
    }
    function switchState(id: number) {
        updateStats(prev => {
            const next = new Map(prev);
            next.set(id, !prev.get(id));
            return next;
        });
    }

    function setState(id: number, value:boolean) {
        updateStats(prev => {
            const next = new Map(prev);
            next.set(id, value);
            return next;
        });
    }

    return (       
        
        <View> 
            <Modal 
                visible={visible}
                transparent={true}
                animationType="slide" 
                onRequestClose={onClose}  
            >
            <View style={styles.main_container}>
                <TouchableOpacity onPress={onClose} style={styles.close}>
                </TouchableOpacity>
                <LinearGradient 
                  style={styles.container}
                  colors={[colors.grad_prim, colors.grad_sec]}
                  start={{x:0, y:0}}
                  end={{x:1, y:1}}
                >
                    
                <CreatPlaylistModal visible={visibleModal} onClose={closeModal}/>
                <TouchableOpacity 
                    onPress={async () => {
                        openModal()
                    }} style={styles.btn_sec}>
                    <View style={styles.btn_icon_sec}>
                        <FontAwesome6 name="add" size={30} color={colors.primary} />
                    </View>                        
                    <Text style={styles.btn_text_sec}>New playlist</Text>
                </TouchableOpacity>
                
                <ScrollView style={styles.main_scroll}>
                    {loadItemsCheck()}
                </ScrollView>
                
                <TouchableOpacity style={styles.btn_prim} onPress={async () => {await savechanges()}}>
                    <Text style={styles.btn_text_prim}>Save changes</Text>
                </TouchableOpacity>
                        
                </LinearGradient>
            </View>
            </Modal>
            
        </View>
    );
};

const styles = StyleSheet.create({
    main_container: {
        flex:1
    },
    container: {
        flex:0.7,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20
    },
    btn_prim:{
        flex:1,
        backgroundColor: colors.primary,
        borderRadius: 20,
        maxHeight: 60,   
        marginVertical: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },    
    btn_text_prim:{
        color: "#000000",
        fontSize: 15,
        fontFamily: 'SpaceGrotesk_400Regular'
    },
    btn_sec:{        
        flex:1,
        flexDirection: 'row',
        backgroundColor: "#b0b0b04e",
        borderRadius: 20,
        padding: 20,
        marginVertical: 15,
        maxHeight: 60,   
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_icon_sec:{  
        flex:0.2,   
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text_sec:{       
        flex:0.8,
        color: colors.secondary,  
        fontSize: 15,      
        textAlign: 'center'
    },
    check_item:{
        flex:1,
        paddingHorizontal: 2,
        flexDirection: 'row',
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    main_scroll: {
        flex:1,
        maxHeight: 300,
    },
    close: {
        flex: 0.3,
    },
});