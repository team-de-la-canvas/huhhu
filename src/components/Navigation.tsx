import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {Text, View} from "react-native";
import HuntingScreen from "../screens/HuntingScreen";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGear, faArrowUp } from "@fortawesome/free-solid-svg-icons";



const Tab = createBottomTabNavigator();


export default function Navigation() {
    return <NavigationContainer>
        <Tab.Navigator  initialRouteName={"Home"}>
            <Tab.Screen name="Settings" component={SettingsScreen} options={{tabBarIcon: ({size, focused, color})=> {
                    return <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
                }}}/>
            <Tab.Screen name="Home" component={HuntingScreen} options={{tabBarIcon: ({size, focused, color})=> {
                    return <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>
            }}}/>
        </Tab.Navigator>
    </NavigationContainer>;
}


function SettingsScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
        </View>
    );
}