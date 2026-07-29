import { Image } from "expo-image";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
/* this scans for any local params being sent to this page
which are sent from the second page if the scan succesfully finds a sensor */


// const DropdownComponent = () => {
//     const [value, setValue] = useState(null);
// }

// fetch("http://192.168.0.90:8000/api/plants")

// .then(response => response.json())

// .then(res => console.log(res))


type Plant = {
    species: string;
}


export default function Index() {

    /* so this starts plants as empty, and i can use setplants as a function to fill that plants variable*/
const [data, setData] = useState([])
const [error, setError] = useState("");

useEffect(() => {
    async function fetchData() {
        const response = await fetch("http://192.168.0.90:8000/api/plants");
        if (!response.ok){
            setError("Failed to fetch data");
        }
        const data = await response.json()
        console.log({data})
        setData(data);
    }
    fetchData();
}, []);

    if (error == "Failed to fetch data"){
        return <text>{error}</text>
    }



  return (
    
    <View style={styles.container}>


        <Image
              style={styles.image}
              source={require('../../assets/images/tick.png')}
              contentFit="contain"
              />
        <Text style={[styles.title]}>Which plant is this sensor for</Text>

        <Text style={[styles.text, styles.subtitle]}>Select an existing plant.</Text>

         <Link href={"/eight_plant_select"} asChild>
            <Pressable style={styles.button}>
                <Text style={styles.buttonText}>Continue</Text>
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
});