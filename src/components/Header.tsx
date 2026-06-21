import { colors } from "@/styles/global";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { Animated, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.7;

export default function Header() {

    const [visible, setVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

    function openSidebar(){
      slideAnim.setValue(-SIDEBAR_WIDTH);
      setVisible(true);
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }

    function closeSidebar(){
        Animated.timing(slideAnim, {
            toValue: -SIDEBAR_WIDTH,
            duration: 300,
            useNativeDriver: true,
        }).start(() => setVisible(false));        
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={openSidebar}>
                <Ionicons name="menu" size={50} color={colors.primary} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}/>
            <TouchableOpacity onPress={openSidebar}>
                <Ionicons name="search" size={40} color={colors.primary} />
            </TouchableOpacity>

            <Modal 
                visible={visible}
                transparent={true}
                animationType="none" 
                onRequestClose={closeSidebar}  
            >
              <View style={styles.overlay}>
                <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }]} ]}>
                  <View style={styles.title_container}>
                    <Text style={styles.title_text}>Mythril Library</Text>
                    <Image source={require("../res/Mithril.png")} style={styles.title_img}/>
                  </View>                  
                </Animated.View>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 60,
    paddingLeft: 10,
    paddingRight: 20
  },

  overlay:{
    flex: 1,
    flexDirection: 'row'
  },
  sidebar: {
    flex: 1,
    backgroundColor: "#3a0f86d6",
    maxWidth: SIDEBAR_WIDTH,
    paddingHorizontal: 20,
    paddingVertical: 60
  },
  close: {
    flex: 0.5,
    backgroundColor: 'transparent'
  },

  title_container: {
    flex:1,
    flexDirection: 'row',
    maxHeight: 80,
  },
  title_text: {
    flex:0.7,
    color: colors.secondary,
    verticalAlign: 'middle',
    alignItems: 'flex-start',
    fontSize: 25
  },
  title_img: {
    flex:0.3,
    maxWidth: 80,
    height: 80,
  }
  

});