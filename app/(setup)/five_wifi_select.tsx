import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";



export default function Index() {
  const {name, signal} = useLocalSearchParams<{
    name: string,
    signal: string,
  }>();

  return (
    
    <View style={styles.container}>


        <Image
              style={styles.image}
              source={require('../../assets/images/wifii.png')}
              contentFit="contain"
              />
        <Text style={[styles.title]}>WIFI SELECT</Text>

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