import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function Index() {
  return (

    <Animated.View
      entering={FadeIn.duration(500)}
      style={styles.container}
    >

    <View
      style={styles.container}>
        <Image
      style={styles.image}
      source={require('../../assets/images/setup_planty.png')}
      contentFit="contain"
      />

      <Text style={[styles.text, styles.title]}>Fourth page</Text>
    

    <View style={styles.instructionRow}>

        <Image
      style={styles.icon}
      source={require('../../assets/images/button press.png')}
      contentFit="contain"
      />

      <Text style={[styles.text, styles.subtitle]}>Hold the button on your sensor for 3 seconds.</Text>
    </View>

    <View style={styles.instructionRow}>

        <Image
      style={styles.icon}
      source={require('../../assets/images/light icon.png')}
      contentFit="contain"
      />

      <Text style={[styles.text, styles.subtitle]}>The light will start blinking when its ready to connect.</Text>
      
      
    </View>
    <Link href={"/second_sensor_search"} asChild>
    <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Add Sensor</Text>
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
    backgroundColor: '#1F4E20',
    width: 200,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '500'
  },

  text:{
    color: '#707B81',
  },

  title:{
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },

  subtitle:{
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
    width: '80%',
    maxWidth: 225,
    marginRight: -40,
    alignSelf: 'center',
  },


  image: {
    width: 250,
    height: 250,
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
    marginRight: 5,
    marginBottom: 10,
},

});