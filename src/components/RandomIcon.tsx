import { colors } from "@/styles/global";
import { FontAwesome } from "@expo/vector-icons";
import TrackPlayer from "@rntp/player";
import { useState } from "react";
import { TouchableOpacity } from "react-native";

export default function RandomIcon({ isShuffled }: { isShuffled: boolean }) {
    
    const [shuffle, setShuffle] = useState<boolean>(TrackPlayer.isShuffleEnabled())
    return (
        <TouchableOpacity style={{
        justifyContent: 'center',
        alignItems: 'center',}} 
        onPress={() => {
            TrackPlayer.setShuffleEnabled(!TrackPlayer.isShuffleEnabled());
            setShuffle(TrackPlayer.isShuffleEnabled());
        }}>
            <FontAwesome name="random" size={30} color={shuffle == true ? colors.primary : "#b0b0b02e"} />
        </TouchableOpacity>
        
    );
}