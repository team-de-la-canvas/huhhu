import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../state/store";
import {match, pullLocation, pushLocation, setMyLocation} from "../state/huntingSlice";
import Pointer from "../components/Pointer";
import * as Location from 'expo-location';
import {Button, StyleSheet, View} from "react-native";
import {flashError, flashSuccess, flashWarning} from "../services/flasher";

const HuntingScreen = () => {
    const dispatch: AppDispatch = useDispatch();
    const myLocation = useSelector((state: RootState) => state.hunting.myLocation);
    const otherLocation = useSelector((state: RootState) => state.hunting.otherLocation);
    const huntingActive = useSelector((state:RootState) => state.hunting.huntingActive);
    const [updateCounter,setUpdateCounter] = useState(0);
    
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
                dispatch(setMyLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }))
                dispatch(pushLocation({
                    args:{},
                    onFailure: flashError
                }))
            })
            .catch(error =>{
                flashError(error)
            });
        if (huntingActive){
            dispatch(pullLocation({
                args:{},
                onFailure: flashError
            }))
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
                    dispatch(match({
                        onFailure: flashError,
                        onSuccess: () => flashSuccess("Successfully Matched!"),
                        args:{}
                    }))
                }} />
            </View>
        )
    }

    return (
        <>
            {huntingActive?<HuntingActiveScenario/>:<SearchingActiveScenario/>}
        </>
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