import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";


export default function TabsLayout() {
  return (
  <Tabs
    screenOptions={{
        tabBarActiveTintColor: '#ce0303',
        headerStyle: {
            backgroundColor: '#ffffff'
        },
        headerShadowVisible: false,
        headerTintColor: '#000000',
        tabBarStyle: {
            backgroundColor: '#ffffff',
        },
    }}
  >
    <Tabs.Screen 
    name="index" 
    options={{
      headerTitle: 'Plant App',
      tabBarIcon: ({focused, color}) => <Ionicons
       name={focused ? "home-sharp" : "home-outline"}
        size={24} 
        color="black" />
    }}/>

    <Tabs.Screen name="about" options={{
      headerTitle: 'About',
      tabBarIcon: ({focused, color}) => <Ionicons
       name={focused ? "information-circle-sharp" : "information-circle-outline"}
        size={24} 
        color="black" />
    }} />
  </Tabs>
  );
}
