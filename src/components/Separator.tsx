import { colors } from "@/styles/global"
import { StyleSheet, View } from "react-native"

export default function Separator() {
    return <View style={style.sep}/>
}

const style = StyleSheet.create({
    sep: {
    flex: 1,
    maxHeight: 1,
    margin: 10,
    backgroundColor: colors.primary
  },
})