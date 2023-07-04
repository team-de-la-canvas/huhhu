import StateProvider from "./src/providers/StateProvider";
import * as React from 'react';
import Root from "./src/Root";
import {PaperProvider} from "react-native-paper";
import FlashMessage from "react-native-flash-message";

const App = () =>
    <StateProvider>    
        <PaperProvider>
            <Root/>
            <FlashMessage position="top" />
        </PaperProvider>
    </StateProvider>
export default App;
