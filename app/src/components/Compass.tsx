import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Magnetometer } from 'expo-sensors';

const Compass = () => {
    const [heading, setHeading] = useState(0);

    useEffect(() => {
        let subscription;
        const startMagnetometer = async () => {
            try {
                await Magnetometer.isAvailableAsync();
                subscription = Magnetometer.addListener(({ x, y }) => {
                    const newHeading = Math.atan2(y, x) * (180 / Math.PI);
                    setHeading(newHeading >= 0 ? newHeading : 360 + newHeading);
                });
                await Magnetometer.setUpdateInterval(100); // Set the update interval in milliseconds
            } catch (error) {
                console.log('Magnetometer sensor is not available.');
            }
        };
        startMagnetometer();

        return () => {
            subscription && subscription.remove();
        };
    }, []);

    return (
        <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>
                Compass Heading: {heading.toFixed(2)}°
            </Text>
        </View>
    );
};

export default Compass;
