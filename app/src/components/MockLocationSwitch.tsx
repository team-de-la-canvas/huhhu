import React from "react";
import {StyleSheet, Switch, View} from "react-native";
import {
    useDisableMockLocation,
    useEnableMockLocation,
} from "../state/huntingSlice";
import {useSelector} from "react-redux";
import {RootState} from "../state/store";

const MockLocationSwitch = () => {

    const enabled = useSelector((state:RootState) => state.hunting.mockedLocation)
    const enableMockLocation = useEnableMockLocation();
    const disableMockLocation = useDisableMockLocation();


    const switchMockStatus = () => {
        if (enabled)
            disableMockLocation()
        else
            enableMockLocation()
    }

    return (
        <View style={styles.container}>
            <Switch
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={enabled ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={switchMockStatus}
                value={enabled}
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


export default MockLocationSwitch;