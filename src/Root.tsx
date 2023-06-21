import {useState} from "react";
import Main from "./Main";
import Login from "./screens/Login";

export default function Root() {
    var [loggedIn, setLoggedIn] = useState(false);
    var [username, setUserName] = useState("");
    return loggedIn? <Main/> : <Login loginWithUsername={username => {
        setUserName(username);
        setLoggedIn(true);
    }}/>
}