import StateProvider from "./src/providers/stateProvider";
import * as React from 'react';
import Root from "./src/Root";

const App = () => 
    <StateProvider>
        <Root/>
    </StateProvider>
export default App;
