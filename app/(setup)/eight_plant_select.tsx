import Entypo from '@expo/vector-icons/Entypo';
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
/* this scans for any local params being sent to this page
which are sent from the second page if the scan succesfully finds a sensor */


// const DropdownComponent = () => {
//     const [value, setValue] = useState(null);
// }

// fetch("http://192.168.0.90:8000/api/plants")

// .then(response => response.json())

// .then(res => console.log(res))


type data = {
  id: number
    species: string;
}

export default function Index() {
    /* so this starts plants as empty, and i can use setplants as a function to fill that plants variable*/
const [data, setData] = useState([]);
const [error, setError] = useState("");
const [value, setValue] = useState<number | null>(null);

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

    const DropdownComponent = () => {
    const renderItem = (item : data) => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.species}</Text>
          
        </View>
      );
    };

    return (
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        containerStyle={styles.dropdownMenu}
        data={data}
        search
        maxHeight={300}
        labelField="species"
        valueField="id"
        placeholder="Select plant"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setValue(item.id);
        }}
        renderLeftIcon={() => (
          <Entypo style={styles.icon} name="leaf" color='#137100ff' size={20}  />
        )}
        renderItem={renderItem}
      />
    );
  };

  


  return (
    <View style={styles.container}>
      
      <Text style={[styles.title]}>Which plant is this sensor for</Text>

      

      <View>
        <DropdownComponent/>
      </View>

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

  dropdownMenu: {
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
  },

  text:{
    color: '#707B81',
  },

  title:{
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
    maxWidth: 270,
    textAlign: 'center',
    color: '#006838',
    marginTop: -120,
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

  dropdown: {
    margin: 16,
    height: 50, 
    width: 300,
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },

  icon: {
    marginRight: 5,
  },

  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textItem: {
    flex: 1,
    fontSize: 16,
  },

  placeholderStyle: {
    fontSize: 16,
    color: '#000000ff',
    fontWeight: '500'
  },

  selectedTextStyle: {
    fontSize: 16,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 12
  },
});