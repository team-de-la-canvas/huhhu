import React, {useEffect} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Image} from "react-native";
import HuntingScreen from "../screens/HuntingScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
                        tabBarIcon: ({ size, focused, color }) => (
                            <Image source={{ width: 30, height: 30, uri:"https://picsum.photos/30/30"}}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Hunting"
                    component={HuntingScreen}
                    options={{
                        tabBarIcon: ({ size, focused, color }) => (
                            <Image source={require('../../assets/arrow-up.png')} style={{ width: 30, height: 30 }}/>
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
