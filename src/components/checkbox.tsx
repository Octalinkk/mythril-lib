import { colors } from "@/styles/global";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { StyleSheet, View } from "react-native";

type state = {
  value: boolean;
};

export default function CheckBox (value: state) {

    if(value.value){
        return (
        <View style={styles.container_on}>
            <FontAwesome5 name="check" size={24} color={colors.primary} />
        </View>
    );
    }
    else{
        return (
            <View style={styles.container_off}>
                <View></View>
            </View>
        );
    }

    

};

const styles = StyleSheet.create({
    container_off:{
        width: 40, 
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.secondary
    },
    container_on:{
        width: 40, 
        height: 40,
        borderRadius: 20,
        backgroundColor: "#0c7d22",
        borderWidth: 1,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    }
});