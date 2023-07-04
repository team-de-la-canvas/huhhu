import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../state/store";
import {match, pullLocation, pushLocation, setMyLocation} from "../state/huntingSlice";
import {Button} from "@mui/material";
import Pointer from "../components/Pointer";
import * as Location from 'expo-location';

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
                    onFailure: console.error
                }))
                if (huntingActive)
                {
                    dispatch(pullLocation({
                        args:{},
                        onFailure: console.error
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
                console.error('Permission to access location was denied');
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
            <Box>
                <Button onClick={()=>{
                    dispatch(match({
                        onFailure: console.error,
                        args:{}
                    }))
                }}>Match now!</Button>
            </Box>
        )
    }

    return (
        <Box>
            {huntingActive?<HuntingActiveScenario/>:<SearchingActiveScenario/>}
        </Box>
    )
}

export default HuntingScreen;