import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../state/store";
import {match, pullLocation, pushLocation, setMyLocation} from "../state/huntingSlice";
import Pointer from "../components/Pointer";
import * as Location from 'expo-location';
import {Button, View} from "react-native";
import {flashError, flashSuccess} from "../services/flasher";

const HuntingScreen = () => {
    const dispatch: AppDispatch = useDispatch();
    const myLocation = useSelector((state: RootState) => state.hunting.myLocation);
    const otherLocation = useSelector((state: RootState) => state.hunting.otherLocation);
    const huntingActive = useSelector((state:RootState) => state.hunting.huntingActive);
    
    const getLocation = async () => {
        
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
                if (huntingActive)
                {
                    dispatch(pullLocation({
                        args:{},
                        onFailure: flashError
                    }))   
                }
            })
            .catch(error =>{
                console.error(error)
            });
    }
    
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                flashError('Permission to access location was denied');
                return;
            }else {
                const locationSetterInterval = setInterval(getLocation, 5000);

                return () => {
                    clearInterval(locationSetterInterval);
                }
            }
        })();
    }, []);
    const HuntingActiveScenario = () => {
        
        return(
            <Pointer myLocation={myLocation} otherLocation={otherLocation}/>
        )
    }

    const SearchingActiveScenario = () => {
        return(
            <View>
                <Button title={"Match now!"} onPress={()=>{
                    dispatch(match({
                        onFailure: flashError,
                        args:{}
                    }))
                }} />
            </View>
        )
    }

    return (
        <View>
            {huntingActive?<HuntingActiveScenario/>:<SearchingActiveScenario/>}
        </View>
    )
}

export default HuntingScreen;