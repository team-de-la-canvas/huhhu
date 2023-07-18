import React, {useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image} from "react-native";
import HuntingScreen from "../screens/HuntingScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();

export default function Navigation() {

    console.log("Navigaton rendered"); // Add this line to track re-renders

    useEffect(()=>{
        console.log("navigation reloaded")
    },[])

    
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Hunting">
                <Tab.Screen
                    name="SettingsStack"
                    component={SettingsScreen}
                    options={{
                        tabBarIcon: ({ size }) => (
                            <Image source={{ width: size, height: size, uri:"https://picsum.photos/30/30"}}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Hunting"
                    component={HuntingScreen}
                    options={{
                        tabBarIcon: ({ size }) => (
                            <Image source={require('../../assets/arrow-up.png')} style={{ width: size, height: size }}/>
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
