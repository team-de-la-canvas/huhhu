import {Text, View} from "react-native";
import Slider from "@react-native-community/slider";
import React, {useState} from "react";

const VisibilitySlider = () => {
    const [sliderValue, setSliderValue] = useState(0);
    const handleSliderChange = (value) => {
        setSliderValue(value);
    };  
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Slider Value: {sliderValue}</Text>
            <Slider
                style={{ width: 200, height: 40 }}
                minimumValue={0}
                maximumValue={100}
                value={sliderValue}
                onValueChange={handleSliderChange}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                thumbTintColor="#0000ff"
            />
        </View>
    )
}

export  default  VisibilitySlider;