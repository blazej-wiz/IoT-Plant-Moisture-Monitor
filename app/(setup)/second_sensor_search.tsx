import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Ripple } from "../../components/setup/ripple";

export default function Index() {
  return (

    <Animated.View
      entering={FadeIn.duration(500)}
      style={styles.container}
    >

    <View
      style={styles.container}>
        
      <Text style={[styles.text, styles.title]}>Searching for nearby sensors...</Text>

      <View style={styles.wrapper}>
        <Ripple delay={0} />
        <Ripple delay={400} />
        <Ripple delay={800} />
      

      <View style={styles.centerDot} />
      </View>

    <Text style={[styles.text, styles.subtitle]}>Make sure your sensor is in pairing mode and close to your phone.</Text>
    
      
    <Link href={"/second_sensor_search"} asChild>
    <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Cancel</Text>
      </Pressable>
      </Link>
   </View>
   </Animated.View>
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
    backgroundColor: '#ffffff',
    width: 200,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    outlineStyle: 'solid',
    outlineColor: '#234409',
    outlineWidth: 1,
  },

  buttonText: {
    fontSize: 18,
    color: '#234409',
    fontWeight: '500'
  },

  text:{
    color: '#707B81',
  },

  title:{
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 100,
    maxWidth: 175,
    textAlign: 'center',
  },

  subtitle:{
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 10,
    width: '80%',
    maxWidth: 250,
    textAlign: 'center',
  },


  image: {
    width: 100,
    height: 100,
    marginBottom: 15,
    marginTop: -50,
  },

  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  icon: {
    width: 27,
    height: 27,
    marginRight: 10,
    marginBottom: 10,
},

  wrapper:{
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
  },

  centerDot: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#dfe9df",
    opacity: 1,
  }

});