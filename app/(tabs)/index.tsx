import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text>Welcome to Plant App</Text>
      
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

  button:{
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#000000'
  }

});
