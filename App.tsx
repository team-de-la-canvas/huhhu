//utils
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';


//expo/rn/react
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';


//mui
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

//Styles
import SpinningText from "./SpinningText";
import StateProvider from "./src/providers/stateProvider";
import ExampleConsumer from "./src/examples/ExampleConsumer";

export default function App() {


  return (
    <StateProvider>
        <ExampleConsumer/>
    </StateProvider>
  );
}

