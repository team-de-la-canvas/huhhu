import StateProvider from "./src/providers/StateProvider";
import * as React from 'react';
import Root from "./src/Root";
import {PaperProvider} from "react-native-paper";
import {SafeAreaView} from "react-native";
// import {SnackbarProvider} from "notistack";

const App = () =>
    <StateProvider>    
        <PaperProvider>
            <SafeAreaView>
                <Root/>
            </SafeAreaView>
            {/*<SnackbarProvider variant={"error"} anchorOrigin={{*/}
            {/*    horizontal: "center",*/}
            {/*    vertical: "top"*/}
            {/*}}>*/}
            {/*    */}
            {/*</SnackbarProvider>*/}
        </PaperProvider>
    </StateProvider>
export default App;
