import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import {Text} from "react-native";
import {Style} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../state/store";
import Geolocation from "@react-native-community/geolocation";
import {setMyLocation} from "../state/huntingSlice";

const HuntingScreen = () => {
    const dispatch: AppDispatch = useDispatch();
    const myLocation = useSelector((state: RootState) => state.hunting.myLocation);
    useEffect(() => {
        console.log("test");
        Geolocation.getCurrentPosition((locationText) => {
            dispatch(setMyLocation({
                latitude: locationText.coords.latitude,
                longitude: locationText.coords.longitude,
            }))
        });
    }, []);

    return (
        <Box style={{
            background: "grey"
        }}>
            <Text>myLocation</Text>
        </Box>
    )
}

export default HuntingScreen;