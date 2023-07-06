import {useState} from "react";
import Main from "./Main";
import Register from "./screens/Register";
import {useSelector} from "react-redux";
import {persistor, RootState} from "./state/store";
import {PersistGate} from "redux-persist/integration/react";

export default function Root() {
    const loggedIn = useSelector((state:RootState) => state.auth.loggedIn);
    return (
        <PersistGate loading={null} persistor={persistor}>
            {loggedIn ? <Main /> : <Register />}
        </PersistGate>
    );
}