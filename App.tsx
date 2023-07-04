import StateProvider from "./src/providers/StateProvider";
import * as React from 'react';
import Root from "./src/Root";
// import {SnackbarProvider} from "notistack";

const App = () => 
    <StateProvider>
        {/*<SnackbarProvider variant={"error"} anchorOrigin={{*/}
        {/*    horizontal: "center",*/}
        {/*    vertical: "top"*/}
        {/*}}>*/}
        {/*    */}
        {/*</SnackbarProvider>*/}
        <Root/>
    </StateProvider>
export default App;
