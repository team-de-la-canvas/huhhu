import React, { useRef, useEffect } from 'react';
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
