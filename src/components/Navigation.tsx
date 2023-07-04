import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import Register from "../screens/Register";
import HuntingScreen from "../screens/HuntingScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Tab.Navigator initialRouteName="Home">
                <Tab.Screen
                    name="SettingsStack"
                    component={SettingsStack}
                    options={{
                        tabBarIcon: ({ size, focused, color }) => (
                            <FontAwesomeIcon icon={faGear} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Home"
                    component={HuntingScreen}
                    options={{
                        tabBarIcon: ({ size, focused, color }) => (
                            <FontAwesomeIcon icon={faArrowUp} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

function SettingsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
    );
}

function SettingsScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Settings Screen</Text>
        </View>
    );
}

// Rest of your code for Register screen
