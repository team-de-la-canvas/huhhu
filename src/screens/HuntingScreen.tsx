import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../state/store";
import Pointer from "../components/Pointer";
import * as Location from 'expo-location';
import {Button, StyleSheet, View,Text} from "react-native";
import {flashError, flashSuccess, flashWarning} from "../services/flasher";
import {useEndpointGetLocationOfMatch, useEndpointMatch, useEndpointSetLocation} from "../state/huntingSlice";
import Slider from "@react-native-community/slider";
import VisibilitySlider from "../components/VisibilitySlider";
import VisibilitySwitch from "../components/VisibilitySwitch";

const HuntingScreen = () => {
    const dispatch: AppDispatch = useDispatch();

    const [updateCounter,setUpdateCounter] = useState(0);
    
    
    const myLocation = useSelector((state: RootState) => state.hunting.myLocation);
    const otherLocation = useSelector((state: RootState) => state.hunting.otherLocation);
    const huntingActive = useSelector((state:RootState) => state.hunting.huntingActive);
    const clientCode = useSelector((state:RootState) => state.auth.code);
    
    const setLocationEndpoint = useEndpointSetLocation({
        onSuccess: () => {},
        onFailure: flashError
    });
    
    const getLocationOfMatchEndpoint = useEndpointGetLocationOfMatch({
        onSuccess: () => {},
        onFailure: flashError
    })
    
    const matchEndpoint = useEndpointMatch({
        onSuccess: () => flashSuccess("Successfully Matched!"),
        onFailure: flashError
    })
    
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                flashError('Permission to access location was denied');
                return;
            }else {
                let current = 0;
                const locationSetterInterval = setInterval(() => {
                    current++;
                    const newUpdateCounterValue= current;
                    setUpdateCounter(newUpdateCounterValue);
                }, 5000);

                return () => {
                    clearInterval(locationSetterInterval);
                }
            }
        })();
    }, []);
    
    useEffect(()=>{
        Location.getCurrentPositionAsync({})
            .then(location => {
                setLocationEndpoint({
                    clientCode,
                    clientLocation: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,   
                    }
                })
            })
            .catch(error =>{
                flashError(error)
            });
        if (huntingActive){
            getLocationOfMatchEndpoint({
                clientCode
            })
        }
    },[updateCounter]);
    const HuntingActiveScenario = () => {
        
        return(
            <View style={styles.pointerScreen}>
                <Pointer myLocation={myLocation} otherLocation={otherLocation}/>
            </View>
        )
    }

    const SearchingActiveScenario = () => {
        return(
            <View>
                <Button title={"Match now!"} onPress={()=>{
                    matchEndpoint({
                        clientCode
                    })
                }} />
            </View>
        )
    }
    
    return (
        <View style={{ flex: 1 }}>
            {/* TOP */}
            <View style={{ flex: 1 }}>
                <VisibilitySwitch />
            </View>
            {/* MID */}
            <View style={{ flex: 7 }}>
                {huntingActive ? <HuntingActiveScenario /> : <SearchingActiveScenario />}
            </View>
            {/* BOT */}
            <View style={{ flex: 1 }}>
                <VisibilitySlider />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    pointerScreen: {
        flex: 1,
        justifyContent: 'center',
        // Add any other styles you want to apply
    },
});


export default HuntingScreen;