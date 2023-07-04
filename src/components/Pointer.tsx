import React, {useRef, useEffect, useState} from 'react';
import {Animated, Easing, StyleSheet, Text} from 'react-native';
import { LocationModel } from "../shared/models";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faArrowUp } from "@fortawesome/free-solid-svg-icons";


type PointerArgs = {
    myLocation: LocationModel,
    otherLocation: LocationModel
}

const Pointer = ({ myLocation, otherLocation }: PointerArgs) => {
    const rotation = useRef(new Animated.Value(0)).current;
    const [valid,setValid] = useState(false);
    useEffect(() => {
        if (myLocation&&otherLocation) {
            setValid(true);
            const angleDeg = calculateAngle();
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
            <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>
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
