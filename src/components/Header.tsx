import { colors } from "@/styles/global";
import { StyleSheet, Text, View } from "react-native";

export default function Header() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Titre</Text>
            <Text style={styles.date}>Titre</Text>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#782121",
    alignItems: "center",
    maxHeight: 80
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.title
  },
  date: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: 30
  }

});