import {useState} from "react";
import Main from "./Main";
import Register from "./screens/Register";
import {useSelector} from "react-redux";
import {RootState} from "./state/store";
// import {persistor, RootState} from "./state/store";
// import {PersistGate} from "redux-persist/integration/react";

export default function Root() {
    console.log("Root rendered"); // Add this line to track re-renders
    const registered = useSelector((state:RootState) => state.hunting.registered);
    return (
        <>
            {registered ? <Main /> : <Register />}
        </>
        // <PersistGate loading={null} persistor={persistor}>
        // </PersistGate>
    );
}