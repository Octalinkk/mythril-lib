import { colors } from "@/styles/global";
import { FontAwesome } from "@expo/vector-icons";

export default function RandomIcon({ isShuffled }: { isShuffled: boolean }) {
    return (
        <FontAwesome 
            name="random" 
            size={30} 
            color={isShuffled ? colors.primary : "#b0b0b02e"} 
        />
    );
}