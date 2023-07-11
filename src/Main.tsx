import React from "react";
import Navigation from "./components/Navigation";
import LocationProvider from "./providers/LocationProvider";

export default function Main() {
    return(
        <>
            <LocationProvider/>
            <Navigation/>
        </>
    )
}