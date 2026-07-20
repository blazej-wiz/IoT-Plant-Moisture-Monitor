import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";



export default function Index() {
  const {name, deviceId} = useLocalSearchParams<{
    name: string,
    deviceId: string,
  }>();

const [password, setPassword]=useState("");
const [wifiname, setName]=useState("");


  return (
    
    <View style={styles.container}>

        <Image
              style={styles.image}
              source={require('../../assets/images/wifii.png')}
              contentFit="contain"
              />
        <Text style={[styles.title]}>Select Wi-Fi Network</Text>

        <Text style={[styles.text, styles.subtitle]}>Your sensor will connect to this network.</Text>

        <Pressable style={styles.button}>

                <TextInput 
                style={styles.buttonText}
                placeholder = 'Enter Wi-Fi Name'
                placeholderTextColor="#2344096d"
                onChangeText={(text) => setName(text)}
                value={wifiname}
                  />
              </Pressable>

        <Pressable style={styles.button}>
                <TextInput 
                style={styles.buttonText}
                placeholder = 'Enter Wi-Fi Password'
                placeholderTextColor="#2344096d"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry
                  />
              </Pressable>


        <Pressable
        style={styles.sendButton}
        /** this should probably send to esp, if thats succesful then go to wifi connecting page maybe */
        onPress={() =>
          router.push({
            pathname: "/six_wifi_connecting",
            params:
            {
              deviceId,
              wifiname,
              password,
            },
          })
        }
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </Pressable>
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
    backgroundColor: '#ffffff',
    width: 200,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 10,
    outlineStyle: "solid",
    outlineColor: '#234409',
    outlineWidth: 1,
  },

  buttonText: {
    fontSize: 18,
    color: '#234409',
    fontWeight: '500',
    paddingLeft: 10,
  },

  sendButton:{
    backgroundColor: '#1F4E20',
    width: 200,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  sendButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: '500',
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