import React, { useRef, useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, Image } from 'react-native';
import {useHuntingSelector, useSetNorthDegrees} from "../state/huntingSlice";

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

                const angleDeg = calculateAngle();
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

    const calculateAngle = () => {
        const dLon = (otherLocation.longitude - myLocation.longitude);
        const y = Math.sin(dLon) * Math.cos(otherLocation.latitude);
        const x = Math.cos(myLocation.latitude) * Math.sin(otherLocation.latitude) - Math.sin(myLocation.latitude) * Math.cos(otherLocation.latitude) * Math.cos(dLon);
        let brng = Math.atan2(y, x);
        brng = brng * (180 / Math.PI);  // convert from radians to degrees
        brng = (brng + 360) % 360;

        // Determine the shortest angle
        if (brng > 180) {
            brng = 360 - brng; // Convert larger angles to their complementary smaller angles
        }

        console.log("calculated angle: ", brng);
        return brng;
    }


    const isRotationPossible = ():boolean => otherLocation && myLocation;
    const Animation = () => (
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
