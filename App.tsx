import StateProvider from "./src/providers/stateProvider";
import * as React from 'react';
import Root from "./src/Root";
import {SnackbarProvider} from "notistack";

const App = () => 
    <StateProvider>
        <SnackbarProvider variant={"error"} anchorOrigin={{
            horizontal: "center",
            vertical: "top"
        }}>
            <Root/>
        </SnackbarProvider>
    </StateProvider>
export default App;
