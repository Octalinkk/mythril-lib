import { getSongById, Song } from "@/db/SongsManager";
import { colors } from "@/styles/global";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AddToPlaylistModal from "../Playlists/addToPlaylist";


type SongOptionsModalProps = {
    visible: boolean;
    onClose: () => void;
    id: number;
};


export default function SongSettingsModal ({ visible, onClose, id }: SongOptionsModalProps) {

    const [song, setSong] = useState<Song>({
        id: 0,
        name: "",
        file_path: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });


    const [visibleModal, setVisibleModal] = useState<boolean>(false)

    useEffect(() => {
        getSongById(id).then(result => {
            if (result) {
                setSong(result)
            }
        });
    }, []);

    
    function openModal(){
        setVisibleModal(true)
    }

    function closeModal(){
        setVisibleModal(false)
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
                
                <View style={styles.items_container_sm}>
                    <Link href={{
                    pathname: "/songSettings",
                    params: {id:[song.id.toString()]},
                    }}
                    onPress={onClose} push asChild>
                        <TouchableOpacity style={styles.btn_cont}>
                            <View style={styles.btn_icon}>
                                <Ionicons name="settings-outline" size={30} color="black" />
                            </View>
                            
                            <Text style={styles.btn_text}>Settings</Text>
                        </TouchableOpacity>
                    </Link>
                    <TouchableOpacity 
                        onPress={async () => {
                            openModal()
                        }} style={styles.btn_cont}>
                        <View style={styles.btn_icon}>
                            <MaterialIcons name="playlist-add" size={30} color="black" />
                        </View>                        
                        <Text style={styles.btn_text}>Add to playlist</Text>
                    </TouchableOpacity>
                    <AddToPlaylistModal id={song.id} visible={visibleModal} onClose={closeModal}/>
                </View>
                        
                        
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
        flex:0.3,
        backgroundColor: "red",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20
    },    
    items_container_sm: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10, 
        gap: 10,
    },
    btn_cont:{        
        width: 100,
        height: 100,
    },
    btn_icon:{        
        width: 100,
        height: 60,
        backgroundColor: colors.primary,        
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    btn_text:{        
        marginTop: 10,
        color: colors.secondary,  
        fontSize: 15,      
        textAlign: 'center'
    },
    close: {
        flex: 0.7,
    },
});