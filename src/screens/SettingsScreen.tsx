import {Button, Text, View} from "react-native";
import React from "react";
import {useSetMockLocation} from "../state/huntingSlice";
import MockLocationSwitch from "../components/MockLocationSwitch";

function SettingsScreen() {

    const setMockLocation = useSetMockLocation();
    
    const setLocationHandler = (latitude: number,longitude:number) => {
        setMockLocation({
            latitude,
            longitude
        })
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View>
                <Text>Mock Locations?</Text>
                <MockLocationSwitch/>
                <Button title={"Rome"} onPress={() => setLocationHandler(12.485110497373249,41.90300603417856)}/>
                <Button title={"Oslo"} onPress={() => setLocationHandler(59.94677567071413, 10.74286626099474)}/>
            </View>
        </View>
    );
}

export  default  SettingsScreen