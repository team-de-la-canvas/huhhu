import {Button, Text, View} from "react-native";
import React from "react";
import {useEndpointInvisible} from "../state/huntingSlice";
import {flashError} from "../services/flasher";
import {useSelector} from "react-redux";
import {RootState} from "../state/store";

function SettingsScreen() {
    const invisible = useEndpointInvisible({
        onFailure: flashError,
        onSuccess: () => {}
    });
    const clientCode = useSelector((state:RootState) => state.hunting.code);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Settings Screen</Text>
            <Button title={"Logout"} onPress={()=> invisible({
                clientCode
            })}></Button>
        </View>
    );
}

export  default  SettingsScreen