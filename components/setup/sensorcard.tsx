import { Image } from "expo-image";
import { Href, Link } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type SensorCardProps = {
    name: string;
    link: Href;
    signal: string;
  
}

export const SensorCard = ({name, link, signal}: SensorCardProps) => {

    return (
    <Link href={ link } asChild>
        <Pressable style={styles.button}>

            <Image
                  style={styles.icon}
                  source={require('../../assets/images/wifi.png')}
                  contentFit="contain"
                  />
            
            <View style={ styles.signalContainer }>
                <Text style={styles.buttonText}>{name}</Text>
              <Text style={styles.buttonSubText}>{signal}</Text>
            </View>
          </Pressable>
          </Link>
    );
}


const styles = StyleSheet.create({
    button:{
    backgroundColor: '#ffffff',
    width: 300,
    height: 70,
    borderRadius: 100,
    marginTop: 24,
    borderColor: '#234409',
    borderWidth: 1,

    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
  },

  buttonText: {
    fontSize: 20,
    color: '#234409',
    textAlign: 'left',
    marginLeft: 20,
    
    
    fontWeight: '600',
  },

  buttonSubText: {
    fontSize: 14,
    color: '#234409',
    textAlign: 'left',
    marginLeft: 20,
    fontWeight: '400',
    marginBottom: 3,
    
    

  },


  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },


  icon: {
    width: 40,
    height: 40,  
    resizeMode: 'contain',  
},

signalContainer: {
    flexDirection: 'column',
},

})
