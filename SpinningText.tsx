import React, { useRef, useEffect } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

const SpinningText = ({children}) => {
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const spin = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const transformStyle = [{
        transform: [
            { rotate: spin }
        ]
    }];

    return (
        <Animated.Text style={[styles.textStyle, transformStyle]}>
            {children}
        </Animated.Text>
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

export default SpinningText;
