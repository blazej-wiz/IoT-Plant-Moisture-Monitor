import { readSetupStatus, sendWifiCredentials } from "@/features/provisioning/bleProvisionService";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";



export default function Index() {
  const {deviceId, wifiname, password} = useLocalSearchParams<{
    deviceId: string,
    wifiname: string,
    password: string,
  }>();

/** this creates a state that react can reuse on update, so it rerenders the return frontend
 * so basically statusmessage is the message that is saved, setstatusmessage just updates that throughout
 */
  const [statusMessage, setStatusMessage] = useState("")
  
  useEffect(() => {
    /** defines setup to wifi function */
    async function setupWifi(){
        try{
            /** creates the first status message of sending the wifi details to sensor */
            setStatusMessage("Sending Wi-Fi details to sensor...");

            await sendWifiCredentials(deviceId, wifiname, password);
            /** once sent, update user to know that now its connecting to wifi */
            setStatusMessage("Connecting sensor to Wi-Fi...");
            /** create a forever loop to constantly check the status of the connection every second */
            const interval = setInterval(async() =>{
                const status = await readSetupStatus(deviceId);
                /** this just checks the status' and will notify the user of what is happening */
                console.log("Current setup status is:", status);

                if (status === "wifi_connected"){
                    clearInterval(interval);

                    router.push({
                      pathname: "/seven_complete",
                      params:
                      {
                        deviceId,
                      }
                    });
                }
                    if (status === "wifi_failed") {
                        clearInterval(interval);

                        setStatusMessage("Wi-Fi connection failed. Please try again.");
                    }
                    
                    }, 1000);
                } catch (error){
                    console.log("Wi-Fi setup failed:", error);
                    setStatusMessage("Wi-Fi setup failed. Please try again.");
                }
            }
            setupWifi();
        }, []);
        


  return (

    
    <View style={styles.container}>


        <Image
              style={styles.image}
              source={require('../../assets/images/wifii.png')}
              contentFit="contain"
              />
        <Text style={[styles.title]}>Connecting to {deviceId}</Text>

        <Text style={[styles.text, styles.subtitle]}>Please wait while we establish a secure connection.</Text>

        <Text style={[styles.text, styles.subtitle]}>{statusMessage}.</Text>

        
            
        
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