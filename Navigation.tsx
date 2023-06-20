import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import TestScreen from "./TestScreen";
import {Text, View} from "react-native";
import TabBarIcon from "@react-navigation/bottom-tabs/lib/typescript/src/views/TabBarIcon";
import {Icon, Stack} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowIcon from '@mui/icons-material/ArrowUpward';
import SpinningText from "./SpinningText";



const Tab = createBottomTabNavigator();


export default function Navigation() {
    return <NavigationContainer>
        <Tab.Navigator  initialRouteName={"Home"}>
            <Tab.Screen name="Settings" component={SettingsScreen} options={{tabBarIcon: ({size, focused, color})=> {
                    return <SettingsIcon/>
                }}}/>
            <Tab.Screen name="Home" component={HomeScreen} options={{tabBarIcon: ({size, focused, color})=> {
                    return(<DeleteIcon style={{color: "red"}}></DeleteIcon>)
            }}}/>
            <Tab.Screen name="Test" component={TestScreen}/>
        </Tab.Navigator>
    </NavigationContainer>;
}


function HomeScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <Stack>
                <SpinningText>
                    <ArrowIcon></ArrowIcon>
                </SpinningText>
            </Stack>
        </View>
    );
}
function SettingsScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
        </View>
    );
}