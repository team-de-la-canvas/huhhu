import StateProvider from "./src/providers/StateProvider";
import * as React from 'react';
import Root from "./src/Root";
import FlashMessage from "react-native-flash-message";
import {Image} from "react-native";

const App = () =>
    <StateProvider>
        <Root/>
        <FlashMessage position="top" />
    </StateProvider>
export default App;
