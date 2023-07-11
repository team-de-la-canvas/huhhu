import React, { useRef, useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, Image } from 'react-native';
import {useHuntingSelector, useSetNorthDegrees} from "../state/huntingSlice";
import Compass from "./Compass";

const Pointer = () => {
    const setNorthDegrees =  useSetNorthDegrees();
    const degrees = useHuntingSelector(x=>x.northDegrees)
    const rotation = useRef(new Animated.Value(degrees)).current;

    const myLocation = useHuntingSelector(state => state.myLocation);
    const otherLocation = useHuntingSelector(state => state.otherLocation);

    const huntingActive = useHuntingSelector(state => state.huntingActive);
    
    const resourceLock = useRef(false);
    useEffect(()=>{
        console.log("entire component reloaded")
    },[]);

    useEffect(() => {
        if (myLocation && otherLocation) {
            if (!resourceLock.current) {
                resourceLock.current = true

                const angleDeg = calculateAzimuth(myLocation.latitude,myLocation.longitude,otherLocation.latitude,otherLocation.longitude);
                Animated.timing(rotation, {
                    toValue: angleDeg,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }).start(() => {
                    setNorthDegrees(angleDeg);
                    resourceLock.current = false;
                });
            }
        }
    }, [myLocation, otherLocation]);

    // const calculateAngle = () => {
    //     const dLon = (otherLocation.longitude - myLocation.longitude);
    //     const y = Math.sin(dLon) * Math.cos(otherLocation.latitude);
    //     const x = Math.cos(myLocation.latitude) * Math.sin(otherLocation.latitude) 
    //         - Math.sin(myLocation.latitude) * Math.cos(otherLocation.latitude) * Math.cos(dLon);
    //     let brng = Math.atan2(y, x);
    //     brng = brng * (180 / Math.PI);  // convert from radians to degrees
    //     brng = (brng + 360) % 360;
    //
    //     // Determine the shortest angle
    //     if (brng > 180) {
    //         brng = 360 - brng; // Convert larger angles to their complementary smaller angles
    //     }
    //
    //     console.log("calculated angle: ", brng);
    //     return brng;
    // }
    
    
    const calculateAngleNew = () => {
        const x1 = myLocation.longitude;
        const y1 = myLocation.latitude;

        const x2 = otherLocation.longitude;
        const y2 = otherLocation.latitude;

        const deltaX = x2-x1;
        const deltaY = y2-y1;
        
        const angleRadians = Math.atan2(deltaY,deltaX);
        const angleDegrees = angleRadians * (180 / Math.PI);
        
        return angleDegrees;
    }

    function calculateAzimuth(lat1, lon1, lat2, lon2) {
        
        // Umwandlung von Grad in Radiant
        lat1 = lat1 * Math.PI / 180.0;
        lon1 = lon1 * Math.PI / 180.0;
        lat2 = lat2 * Math.PI / 180.0;
        lon2 = lon2 * Math.PI / 180.0;

        // Differenz der Längengrade
        var dLon = lon2 - lon1;

        // Berechnung des Azimuts
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
        var azimuth = Math.atan2(y, x);

        // Umwandlung von Radiant in Grad
        azimuth = azimuth * 180 / Math.PI;

        // Normalisierung auf 0 - 360
        if (azimuth < 0) {
            azimuth += 360;
        }

        return azimuth;
    }


    const isRotationPossible = ():boolean => otherLocation && myLocation;
    const Animation = () => (
        <>
            <Compass/>
            <Animated.View style={[styles.animationContainer, {
                transform: [
                    {
                        rotate: rotation.interpolate({
                            inputRange: [0, 360],
                            outputRange: ['0deg', '360deg']
                        })
                    }
                ]
            }]}>
                <Image source={require('../../assets/arrow-up.png')} style={{ width: 500, height: 500 }} />
            </Animated.View>
        </>
    );

    return (
        <>
            {huntingActive ? <Animation /> : <Text>No navigation possible</Text>}
        </>
    );
};

const styles = StyleSheet.create({
    animationContainer: {
        width: 500,
        height: 500,
    },
});

export default Pointer;
