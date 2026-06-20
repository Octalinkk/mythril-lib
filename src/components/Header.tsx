import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.7;

export default function Header() {

    const [visible, setVisible] = useState(false);

    function openSidebar(){
        setVisible(true)
    }

    function closeSidebar(){
        setVisible(false)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openSidebar}>
                <Ionicons name="menu" size={50} color={colors.primary} />
            </TouchableOpacity>
            <Modal 
                visible={visible}
                transparent={true}
                animationType="none" 
                onRequestClose={closeSidebar}  
            >
              <View style={styles.overlay}>
                <View style={styles.sidebar}>
                  <Text>Contenu</Text>
                </View>
                <TouchableOpacity onPress={closeSidebar} style={styles.close}>
                </TouchableOpacity>
              </View>
            </Modal>
        </View>

    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#782121",
    justifyContent: 'center',
    alignItems: 'flex-start',
    maxHeight: 60
  },
  overlay:{
    flex: 1,
    flexDirection: 'row'
  },
  sidebar: {
    flex: 1,
    backgroundColor: "#ffffffd6",
    maxWidth: SIDEBAR_WIDTH,
    paddingHorizontal: 20,
    paddingVertical: 60
  },
  close: {
    flex: 0.5,
    backgroundColor: 'transparent'
  }
  

});