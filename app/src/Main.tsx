import React from "react";
import Navigation from "./components/Navigation";
import LocationProvider from "./providers/LocationProvider";

export default function Main() {
    console.log("Main rendered"); // Add this line to track re-renders

    return(
        <>
            <LocationProvider/>
            <Navigation/>
        </>
    )
}