//utils
import axios from "axios";
import Geolocation from "@react-native-community/geolocation";

//expo/rn/react
import { StatusBar } from "expo-status-bar";
import {StyleSheet, Text, TextInput, View} from "react-native";
import React, { useState, useEffect } from "react";

//mui
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

//Styles
import SpinningText from "../components/SpinningText";
import { Visibility } from "@mui/icons-material";
import {Button, TextField, ToggleButton} from "@mui/material";

export default function TestScreen() {
     
    var [apiJson, setApiJson] = useState({});
    const [page, setPage] = React.useState(0);
    const [visible, setVisibility] = React.useState(false);
    useEffect(() => {
        Geolocation.getCurrentPosition((locationText) => {
            setLocationJson(locationText);
            console.log(locationText);
        });
        axios.get("https://jsonplaceholder.typicode.com/todos/1").then((result) => {
            setApiJson(result);
            console.log(result);
        });

        axios.get("http://localhost:3000").then((result) => {
            console.log(result);
        });
        axios.post("http://localhost:3000/login", {
            clientName: "client " + Math.random(),
        });
        axios.get("http://localhost:3000/clients").then((res) => {
            console.log(res);
        });
    }, []);


    return (
        <View style={styles.container}>
            <Text>
                Some json from placeholder api:
                https://jsonplaceholder.typicode.com/todos/1{" "}
            </Text>
            <Text>
                {apiJson.data != null
                    ? apiJson.data.title
                    : "Not received data from api yet"}
            </Text>
            <Text>latitude:</Text>
            <Text>
                {location.coords != null
                    ? location.coords.latitude
                    : "not received location yet"}
            </Text>
            <Text>elevation:</Text>
            <Text>
                {location.coords != null
                    ? location.coords.elevation
                    : "not received location yet"}
            </Text>
            <SpinningText>longitude:</SpinningText>
            <Text>
                {location.coords != null
                    ? location.coords.longitude
                    : "not received location yet"}
            </Text>
            <ToggleButton
                label="Nearby"
                icon={<LocationOnIcon />}
                onClick={() => setVisibility(!visible)}
            />
            <StatusBar style="auto" />

            <BottomNavigation
                showLabels
                value={page}
                onChange={(event, newValue) => {
                    setPage(newValue);
                }}
            >
                <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
                <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
                <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
            </BottomNavigation>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
