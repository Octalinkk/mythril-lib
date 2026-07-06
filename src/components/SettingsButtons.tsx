import { getSongById, Song } from "@/db/SongsManager";
import { colors } from "@/styles/global";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from 'react-native-webview';

type Id = {
  song_id: number;
};


export default function SettingBtn (id: Id) {

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
    const [visibleSearch, setVisibleSearch] = useState<boolean>(false)

    useEffect(() => {
        getSongById(id.song_id).then(result => {
            if (result) setSong(result);
        });
    }, []);


    function openModal(){
        setVisibleModal(true)
    }

    function closeModal(){
        setVisibleModal(false)
    }

    function openSearch(){
        closeModal()
        setVisibleSearch(true)
    }

    function closeSearch(){
        setVisibleSearch(false)
    }


    return (       
        
        <View> 
            <TouchableOpacity style={styles.icon} onPress={openModal}>
                <SimpleLineIcons name="options-vertical" size={10} color={colors.primary} />
            </TouchableOpacity>
            <Modal 
                visible={visibleModal}
                transparent={true}
                animationType="slide" 
                onRequestClose={closeModal}  
            >
            <View style={styles.main_container}>
                <TouchableOpacity onPress={closeModal} style={styles.close}>
                </TouchableOpacity>
                <LinearGradient 
                      style={styles.container}
                      colors={[colors.grad_prim, colors.grad_sec]}
                      start={{x:0, y:0}}
                      end={{x:1, y:1}}
                    >
                        <TouchableOpacity style={styles.btn} onPress={openSearch}>
                            <Text>Search Online</Text>
                        </TouchableOpacity>
                </LinearGradient>
            </View>
            </Modal>
            <Modal 
                visible={visibleSearch}
                transparent={true}
                animationType="slide" 
                onRequestClose={closeSearch}  
            >
                <View style={styles.main_container}>
                    <WebView
                        source={{ uri: `https://www.google.com/search?sxsrf=APpeQnvKONL8cw888eX7mI--vukP_XJQqw:1783339800397&udm=2&q=${song.name}+album+cover` }}
                    />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    main_container: {
        flex:1,
    },
    container: {
        flex:0.4,
        backgroundColor: "red",
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 40
    },
    btn: {
        flex:1,
        maxHeight: 50,
        backgroundColor: "white"
    },
    close: {
        flex: 0.6,
    },
    icon:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});