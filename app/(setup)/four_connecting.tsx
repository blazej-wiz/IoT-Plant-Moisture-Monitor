import { connectToPlantSensor } from "@/features/provisioning/bleProvisionService";
import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";



export default function Index() {
  const {deviceId, name} = useLocalSearchParams<{
    deviceId: string,
    name: string,
  }>();

  useEffect(() => {
    async function connect(){

      try {
        await connectToPlantSensor(deviceId);

        router.push({
          pathname: "/five_wifi_select",
          params: { deviceId, name},
        });

      } catch (error) {
        console.log("Connection failed", error);
        /** could maybe have a different page to show the error occured or just a popup then route
         * back to main page
         */
      }
    }
    connect();
  }, []);
    
  
  return (

    
    <View style={styles.container}>


        <Image
              style={styles.image}
              source={require('../../assets/images/wifii.png')}
              contentFit="contain"
              />
        <Text style={[styles.title]}>Connecting to {name}</Text>

        <Text style={[styles.text, styles.subtitle]}>Please wait while we establish a secure connection.</Text>

        
            
        <Link href={"/five_wifi_select"} asChild>
            <Pressable>
                <Text>Next page</Text>
              </Pressable>
              </Link>
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