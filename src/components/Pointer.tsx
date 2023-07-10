import React, {useRef, useEffect, useState} from 'react';
import {Animated, Easing, StyleSheet, Text,Image} from 'react-native';
import {useHuntingSelector} from "../state/huntingSlice";



const Pointer = () => {
    const rotation = useRef(new Animated.Value(0)).current;
    const [valid,setValid] = useState(false);

    const myLocation = useHuntingSelector(state =>state.myLocation);
    const otherLocation = useHuntingSelector(state =>state.otherLocation);
    useEffect(() => {
        if (myLocation&&otherLocation) {
            setValid(true);
            const angleDeg = calculateAngle();
            console.log(rotation)
            Animated.timing(rotation, {
                toValue: angleDeg,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start();
        } else {
            setValid(false);
        }
    }, [myLocation, otherLocation]);

    const calculateAngle = () => {
        const dLon = (otherLocation.longitude - myLocation.longitude);
        const y = Math.sin(dLon) * Math.cos(otherLocation.latitude);
        const x = Math.cos(myLocation.latitude) * Math.sin(otherLocation.latitude) - Math.sin(myLocation.latitude) * Math.cos(otherLocation.latitude) * Math.cos(dLon);
        let brng = Math.atan2(y, x);
        brng = brng * (180 / Math.PI);  // convert from radians to degrees
        brng = (brng + 360) % 360;
        brng = 360 - brng; // count degrees counter-clockwise - remove to make clockwise
        return brng;
    }


    const transformStyle = [{
        transform: [{ rotate: `${rotation}deg` }]
    }];

    const Animation = () => 
        <Animated.Text style={[styles.textStyle, transformStyle]}>
            <Image source={require('../../assets/arrow-up.png')} style={{ width: 500, height: 500 }}/>
        </Animated.Text>
    
    return (
        <>
            {valid?<Animation/>:<Text>No navigation possible</Text>}
        </>
    );
};

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'blue',
        // Add any other styles you want to apply
    },
});

export default Pointer;
