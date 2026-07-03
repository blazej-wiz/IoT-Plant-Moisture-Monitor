import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { SensorCard } from "../../components/setup/sensorcard";

export default function Index() {
  return (
    <View style={styles.container}>


        <Image
              style={styles.image}
              source={require('../../assets/images/tick.png')}
              contentFit="contain"
              />
        <Text style={[styles.title]}>Sensor Found!</Text>

        <Text style={[styles.text, styles.subtitle]}>Select your sensor to connect.</Text>


        <SensorCard
         name="Sensor 1"
         link="/four_connecting"
         signal='Strong'
         />

        
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

  

  text:{
    color: '#707B81',
  },

  title:{
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 17,
    maxWidth: 200,
    textAlign: 'center',
    color: '#006838',
  },

  subtitle:{
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 17,

     
    width: '80%',
    maxWidth: 250,
    textAlign: 'center',
  },


  image: {
    width: 70,
    height: 70,
    marginBottom: 17,
    marginTop: -200,
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