import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SensorCard } from "../../components/setup/sensorcard";

/* this scans for any local params being sent to this page
which are sent from the second page if the scan succesfully finds a sensor */
export default function Index() {
  const {deviceId, name, signal} = useLocalSearchParams<{
    deviceId: string,
    name: string,
    signal: string,
  }>();

  return (
    
    <View style={styles.container}>


        <Image
              style={styles.image}
              source={require('../../assets/images/tick.png')}
              contentFit="contain"
              />
        <Text style={[styles.title]}>Sensor Found!</Text>

        <Text style={[styles.text, styles.subtitle]}>Select your sensor to connect.</Text>

        <Animated.View
              entering={FadeInDown.duration(700)}
            >

              
        <SensorCard
         name = {name}
         signal = {signal}
         deviceId = {deviceId}
         link={{pathname: "/four_connecting",
          params: {
            deviceId,
            name
          }
         }}
        
         />
         </Animated.View>
{/* export function mockData() {
    return (
    router.push({
        pathname: "/third_sensor_found",
        params: {
            name: 'GrowSense Sensor',
            signal: 'Strong',
        },
}))
 
} */}
        
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