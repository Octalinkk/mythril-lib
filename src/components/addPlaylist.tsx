import { colors } from "@/styles/global";
import { LinearGradient } from "expo-linear-gradient";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { addPlaylist, Playlist } from "@/db/PlaylistsManager";
import { useState } from "react";

type SongOptionsModalProps = {
    visible: boolean;
    onClose: () => void;
};

async function addNewPlst(name:string){
    const newPlaylist:Playlist = {
        id: 0,
        name: name,
        cover: "",
        last_time_played: new Date().toISOString(),
        time_listened: 0,
        time_started: 0
    }
    await addPlaylist(newPlaylist)
    console.log("Adding new Playlist : ", name)
}


export default function CreatPlaylistModal ({ visible, onClose }: SongOptionsModalProps) {

    
    const [name, setName] = useState<string>("")

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
                  <View style={styles.field_container}>
                      <Text style={styles.field_title}>Title</Text>
                      <TextInput
                          style={styles.field_input}
                          onChangeText={(name) => setName(name)}
                          inputMode='text'
                          value={name}
                          placeholder="playlist name"
                          placeholderTextColor ={colors.secondary}
                      />
                  </View>
                  <TouchableOpacity style={styles.btn} onPress={async () => {
                                              await addNewPlst(name)
                                              onClose()
                                          }}>                            
                      <Text style={styles.btn_text}>Create playlist</Text>
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
      flex:0.3,
      borderTopLeftRadius: 40,
      borderTopRightRadius: 40,
      padding: 40,
      gap: 10
  },

  btn: {
      flex:1,
      maxHeight: 60,
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding:20,
      justifyContent: 'center',
      alignItems: 'center',
  },
  btn_text:{
      color: "#000000",
      fontSize: 15,
      fontFamily: 'SpaceGrotesk_400Regular'
  },
  field_container:{
      flex: 1,
      maxHeight: 80,
  },
  field_title:{
      flex: 1,
      fontFamily: 'SpaceGrotesk_400Regular',
      fontSize: 15,
      color: colors.primary,
      maxHeight: 20,
  },
  field_input:{
      flex: 1,
      fontFamily: 'SpaceGrotesk_400Regular',
      fontSize: 15,
      maxHeight: 50,
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
      color: colors.primary
  },
  
  close: {
      flex: 0.7,
  },
});