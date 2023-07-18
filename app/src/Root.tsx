import Main from "./Main";
import Register from "./screens/Register";
import {useSelector} from "react-redux";
import {RootState} from "./state/store";

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