import { Text, View, StyleSheet, Platform } from "react-native";
import * as Device from "expo-device"

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Saluuut</Text>
      <Text>Running on : {Platform.OS} {Platform.Version}</Text>
      <Text>Running on : {Device.brand}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
