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
    const huntingActive = useSelector((state:RootState) => state.hunting.huntingActive);
    const clientCode = useSelector((state:RootState) => state.hunting.code);

    

    console.log("Hunting screen rendered"); // Add this line to track re-renders

    useEffect(()=>{
        console.log("hunting screen reloaded")
    },[])

    useEffect(()=>{
        console.log("hunting active changed to ",huntingActive)
    },[huntingActive])

    useEffect(()=>{
        console.log("clientCode changed to ",clientCode)
    },[clientCode])

    
    
    const HuntingActiveScenario = () => {
        console.log("hunting active scenario rendered")
        useEffect(()=>{
            console.log("hunting active scenario reloaded")
        },[])
        return(
            <View style={styles.pointerScreen}>
                <Pointer/>
            </View>
        )
    }

    const SearchingActiveScenario = () => {

        const matchEndpoint = useEndpointMatch({
            onSuccess: () => flashSuccess("Successfully Matched!"),
            onFailure: flashError
        })
        
        
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
            <View style={{ flex: 7, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
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