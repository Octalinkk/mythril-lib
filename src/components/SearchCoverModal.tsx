import { Artist, getArtistById } from "@/db/ArtistsManager";
import { getSongById, Song } from "@/db/SongsManager";
import { colors } from "@/styles/global";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { getArtistsBySongId } from "@/db/SongsArtistsManager";
import { Directory, File, Paths } from 'expo-file-system';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

type Id = {
};
type SongOptionsModalProps = {
    visible: boolean;
    onClose: () => void;
    returnFileResult: (file:File) => void;
    id: number;
};


export default function SearchCoverModal ({ visible, onClose, id, returnFileResult }: SongOptionsModalProps) {

    const [song, setSong] = useState<Song>({
        id: 0,
        name: "",
        file_path: "",
        cover: "",
        last_time_played: "",
        time_listened: 0,
        time_started: 0
    });

    const [artists, setArtists] = useState<Artist[]>([]);

    const [visibleSearch, setVisibleSearch] = useState<boolean>(false)

    useEffect(() => {
        getSongById(id).then(result => {
            if (result) {
                setSong(result)
                getArtistsforSongId(result.id).then(res => {
                    setArtists(res)
                })
            }
        });
    }, []);

    
    const used_event = useRef<boolean>(false);


    async function getArtistsforSongId(songId:number){
        const artistsIds = await Promise.resolve(
            getArtistsBySongId(songId)
        );
        const artists = await Promise.all(
            artistsIds.map(id => getArtistById(+id))
        );
        return artists.filter((artist): artist is Artist => artist !== null);
    }


    function openSearch(){
        onClose
        setVisibleSearch(true)
        used_event.current = false
    }

    function closeSearch(){
        setVisibleSearch(false)
    }

    const injectedJS = `
        // Intercepte le clic sur les images
        document.addEventListener('click', function(e) {
            const img = e.target.closest('img');
            if (img && img.src) {
                window.ReactNativeWebView.postMessage(img.src);
                e.preventDefault();
            }
        }, true);
    `;

    async function onMessage(event: WebViewMessageEvent) {
        if(!used_event.current){
            used_event.current = true
            const imageUrl = event.nativeEvent.data
            if (imageUrl && imageUrl != ""){
                const dir = new Directory(Paths.document, 'songCover')
                const destination = new File (dir.uri + `/${song.id}-temp.jpg`)
                if (!dir.exists){
                    dir.create()                    
                }
                if(destination.exists){
                    await destination.delete()
                }
                try {                
                    const output = await File.downloadFileAsync(imageUrl, destination)
                    if (output.exists && output.uri != "" && output.uri){
                        song.cover = output.uri
                        //TODO Need to add a prop to define if it's song/album/artist
                        await returnFileResult(output)
                    }
                } catch (error) {
                    
                }
            }
            closeSearch()
            onClose()
        }
    }

    function getQuery(){
        if (artists.length < 1){
            return song.name
        }
        else{            
            const names = artists.filter((artist): artist is Artist => artist !== null).map(artist => artist.name);
            return String(song.name + "+" + names.join("+"))
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
                        <TouchableOpacity style={styles.btn} onPress={openSearch}>
                            <View  style={styles.btn_icon}><MaterialCommunityIcons name="web" size={24} color="black"/></View>
                            
                            <View  style={styles.btn_text}><Text   style={styles.text}>Search Online</Text></View>
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
                        source={{ uri: `https://www.google.com/search?sxsrf=APpeQnvKONL8cw888eX7mI--vukP_XJQqw:1783339800397&udm=2&q=${getQuery()}+album+cover` }}
                        onMessage={onMessage}
                        injectedJavaScript={injectedJS}
                    />
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
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: 40
    },
    btn: {
        flex:1,
        flexDirection: 'row',
        maxHeight: 50,
        backgroundColor: colors.primary,
        borderRadius: 20
    },
    btn_icon:{
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text:{
        flex: 0.8,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text:{  
        fontSize: 20,
        fontFamily: 'SpaceGrotesk_400Regular'
    },
    close: {
        flex: 0.7,
    },
});