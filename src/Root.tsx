import {useState} from "react";
import Main from "./Main";
import Register from "./screens/Register";
import {useSelector} from "react-redux";
import {persistor, RootState} from "./state/store";
import {PersistGate} from "redux-persist/integration/react";

export default function Root() {
    const registered = useSelector((state:RootState) => state.auth.registered);
    return (
        <PersistGate loading={null} persistor={persistor}>
            {registered ? <Main /> : <Register />}
        </PersistGate>
    );
}