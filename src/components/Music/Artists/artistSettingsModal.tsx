import { Artist, getArtistById, updateArtist } from "@/db/ArtistsManager";
import { colors } from "@/styles/global";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type ArtistOptionsModalProps = {
    visible: boolean;
    onClose: () => void;
    id: number;
};


export default function ArtistSettingsModal ({ visible, onClose, id }: ArtistOptionsModalProps) {

    const [artist, setArtist] = useState<Artist>({
        id: 0,
        name: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0,
        pinned: 0
    });


    useEffect(() => {
        getArtistById(id).then(result => {
            if (result) {
                setArtist(result)
            }
        });
    }, [artist]);

    function getPinbutton(){
        if (artist.pinned == 0){
            return (
                <TouchableOpacity 
                        onPress={async () => {
                            artist.pinned = 1
                            await updateArtist(artist)
                }} style={styles.btn_cont}>
                    <View style={styles.btn_icon}>
                        <MaterialCommunityIcons name="pin-outline" size={30} color="black" />
                    </View>                        
                    <Text style={styles.btn_text}>Pin</Text>
                </TouchableOpacity>
            )
        }
        else {
            return (
                <TouchableOpacity 
                        onPress={async () => {
                            artist.pinned = 0
                            console.log(artist)
                            await updateArtist(artist)
                }} style={styles.btn_cont}>
                    <View style={styles.btn_unpin}>
                        <MaterialCommunityIcons name="pin-outline" size={30} color={colors.primary} />
                    </View>                        
                    <Text style={styles.btn_text}>Unpin</Text>
                </TouchableOpacity>
            )
        }
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
                    pathname: "/Music/artistSettings",
                    params: {id:[artist.id.toString()]},
                    }}
                    onPress={onClose} push asChild>
                        <TouchableOpacity style={styles.btn_cont}>
                            <View style={styles.btn_icon}>
                                <Ionicons name="settings-outline" size={30} color="black" />
                            </View>
                            
                            <Text style={styles.btn_text}>Settings</Text>
                        </TouchableOpacity>
                    </Link>

                    {getPinbutton()}
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
    btn_unpin:{        
        width: 100,
        height: 60,
        backgroundColor: colors.danger,        
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