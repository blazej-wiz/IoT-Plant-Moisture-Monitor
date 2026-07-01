import { StyleSheet, Text, View } from "react-native";

export default function aboutssss() {
  return (
    <View
      style={styles.container}>
      <Text>About Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
