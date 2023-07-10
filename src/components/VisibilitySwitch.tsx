import React, {useState} from "react";
import {StyleSheet, Switch, View} from "react-native";
import {useEndpointInvisible, useEndpointVisible} from "../state/huntingSlice";
import {flashError} from "../services/flasher";
import {useSelector} from "react-redux";
import {RootState} from "../state/store";

const VisibilitySwitch = () => {

    const visibility = useSelector((state:RootState) => state.hunting.visible)

    
    const clientCode = useSelector((state:RootState) => state.hunting.code)
    
    const visible = useEndpointVisible({
        onFailure: flashError,
    });
    const invisible = useEndpointInvisible({
        onFailure: flashError,
    });
    
    
    const switchVisibility = () => {
        if (visibility)
            invisible({
                clientCode
            });
        else
            visible({
                clientCode
            });
    }

    return (
        <View style={styles.container}>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={visibility ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={switchVisibility}
                value={visibility}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default VisibilitySwitch;