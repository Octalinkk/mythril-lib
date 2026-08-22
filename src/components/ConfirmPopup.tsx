import { colors } from "@/styles/global";
import { LinearGradient } from "expo-linear-gradient";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";


type SongOptionsModalProps = {
    visible: boolean;
    text: string
    onClose: () => void;
    onConfirm: () => Promise<void>;
    danger: "info" | "warning" | "danger"
};


export default function ConfirmationModal ({ visible, onClose, onConfirm, text, danger }: SongOptionsModalProps) {

    function getConfirmButton(){
        switch (danger){
            case "info": {
                return (
                    <TouchableOpacity style={styles.btn_normal} onPress={onConfirm}>                            
                        <Text style={styles.btn_text_fill}>Confirm</Text>
                    </TouchableOpacity>
                )
            }
            case "warning": {
                return (
                    <TouchableOpacity style={styles.btn_warn} onPress={onConfirm}>                            
                        <Text style={styles.btn_text_fill}>Confirm</Text>
                    </TouchableOpacity>
                )
            }
            case "danger": {
                return (
                    <TouchableOpacity style={styles.btn_danger} onPress={onConfirm}>                            
                        <Text style={styles.btn_text_fill}>Confirm</Text>
                    </TouchableOpacity>
                )
            }
        }
        
    }

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
                        <View style={styles.btn_container}>
                            <TouchableOpacity style={styles.button_bordered} onPress={onClose}>                            
                                <Text style={styles.btn_text_border}>Cancel</Text>
                            </TouchableOpacity>
                            {getConfirmButton()}
                        </View>
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
        borderRadius: 40,
        padding: 40,
        gap:20
    },    
    btn_container: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    button_bordered:{
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        gap: 20,
        borderRadius: 20,
        maxHeight: 50,
        minHeight: 50,
        borderWidth: 2,
        borderColor: colors.primary,
        marginVertical: 10
    },
    btn_normal: {
        flex:0.5,
        flexDirection: 'row',
        maxHeight: 50,
        minHeight: 50,
        backgroundColor: colors.primary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_warn: {
        flex:0.5,
        flexDirection: 'row',
        maxHeight: 50,
        minHeight: 50,
        backgroundColor: colors.warning,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_danger: {
        flex:0.5,
        flexDirection: 'row',
        maxHeight: 50,
        minHeight: 50,
        backgroundColor: colors.danger,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_icon:{
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_text_border:{
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontFamily: 'SpaceGrotesk_400Regular',
        color: colors.primary
    },
    btn_text_fill:{
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