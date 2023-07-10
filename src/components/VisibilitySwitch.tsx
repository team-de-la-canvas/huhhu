import React, {useState} from "react";
import {StyleSheet, Switch, View} from "react-native";
import {useEndpointInvisible, useEndpointVisible} from "../state/authSlice";
import {flashError} from "../services/flasher";
import {useSelector} from "react-redux";
import {RootState} from "../state/store";

const VisibilitySwitch = () => {

    const toggleSwitch = () => {
        setVisibilitySwitchEnabled((previousState) => !previousState);
    };
    
    const clientCode = useSelector((state:RootState) => state.auth.code)
    
    const [visibilitySwitchEnabled, setVisibilitySwitchEnabled] = useState(false);
    const visible = useEndpointVisible({
        onFailure: flashError,
        onSuccess: toggleSwitch
    });
    const invisible = useEndpointInvisible({
        onFailure: flashError,
        onSuccess: toggleSwitch
    });
    
    
    const switchVisibility = () => {
        if (visibilitySwitchEnabled)
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
                thumbColor={visibilitySwitchEnabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={switchVisibility}
                value={visibilitySwitchEnabled}
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