import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import {Text} from "react-native";
import {Style} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../state/store";
import Geolocation from "@react-native-community/geolocation";
import {match, pullLocation, pushLocation, setMyLocation} from "../state/huntingSlice";
import SpinningText from "../components/SpinningText";
import {Button} from "@mui/material";
import Pointer from "../components/Pointer";

const HuntingScreen = () => {
    const dispatch: AppDispatch = useDispatch();
    const myLocation = useSelector((state: RootState) => state.hunting.myLocation);
    const otherLocation = useSelector((state: RootState) => state.hunting.otherLocation);
    const huntingActive = useSelector((state:RootState) => state.hunting.huntingActive);
    useEffect(() => {
        const locationSetterInterval = setInterval(() => {
            Geolocation.getCurrentPosition((location) => {
                dispatch(setMyLocation({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }))
                dispatch(pushLocation({
                    args:{},
                    onFailure: console.error
                }))
                dispatch(pullLocation({
                    args:{},
                    onFailure: console.error
                }))
            });
        }, 5000);
        
        return () => {
            clearInterval(locationSetterInterval);
        }
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