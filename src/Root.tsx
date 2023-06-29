import {useState} from "react";
import Main from "./Main";
import Register from "./screens/Register";
import {useSelector} from "react-redux";
import {RootState} from "./state/store";

export default function Root() {
    const loggedIn = useSelector((state:RootState) => state.auth.loggedIn);
    return loggedIn? <Main/> : <Register/>
}