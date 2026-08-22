import { colors } from "@/styles/global";
import { LinearGradient } from "expo-linear-gradient";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type SongOptionsModalProps = {
    visible: boolean;
    text: string
    onClose: () => Promise<void>;
};


export default function InformationModal ({ visible, onClose, text }: SongOptionsModalProps) {


    return (       
        
        <View> 
            <Modal 
                visible={visible}
                transparent={true}
                animationType="fade" 
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
                        <Text style={styles.text}>{text}</Text>
                        <TouchableOpacity style={styles.btn} onPress={onClose}>                            
                            <View style={styles.btn_text}><Text style={styles.btn_text}>Confirm</Text></View>
                        </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity onPress={onClose} style={styles.close}>
                </TouchableOpacity>
            </View>
            </Modal>            
        </View>
    );
};

const styles = StyleSheet.create({
    main_container: {
        margin:20,
        flex:1
    },
    container: {
        flex:0.3,
        backgroundColor: "red",
        borderRadius: 40,
        padding: 40,
        gap:20
    },
    
    btn: {
        flex:1,
        flexDirection: 'row',
        maxHeight: 50,
        backgroundColor: colors.primary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_icon:{
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text:{
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: "black"
    },
    text:{  
        flex: 0.8,
        fontSize: 20,
        fontFamily: 'SpaceGrotesk_400Regular',
        color: colors.primary
    },
    close: {
        flex: 0.3,
    },
});