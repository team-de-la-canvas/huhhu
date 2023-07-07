import {Button, Text, View} from "react-native";
import React from "react";
import {useInvisible} from "../state/authSlice";
import {flashError} from "../services/flasher";
import {useSelector} from "react-redux";
import {RootState} from "../state/store";

function SettingsScreen() {
    const invisible = useInvisible({
        onFailure: flashError,
        onSuccess: () => {}
    });
    const clientCode = useSelector((state:RootState) => state.auth.code);
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