import {useEffect, useRef, useState} from "react";
import * as Location from "expo-location";
import {flashError} from "../services/flasher";
import {useEndpointGetLocationOfMatch, useEndpointSetLocation} from "../state/huntingSlice";
import {RootState} from "../state/store";
import {useSelector} from "react-redux";

const LocationProvider = () => {

    const [updateCounter,setUpdateCounter] = useState(0);
    const huntingActive = useSelector((state:RootState) => state.hunting.huntingActive);
    const clientCode = useSelector((state:RootState) => state.hunting.code);


    useEffect(()=>{
        console.log("location provider remounted")
    },[])


    const setLocationEndpoint = useEndpointSetLocation({
        onSuccess: () => {},
        onFailure: flashError
    });

    const getLocationOfMatchEndpoint = useEndpointGetLocationOfMatch({
        onSuccess: () => {},
        onFailure: flashError
    })
    const resourceLock = useRef(false);
    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted'){
                flashError('Permission to access location was denied');
                return;
            }
                
            
            //Mutex
            if (!resourceLock.current){
                

                resourceLock.current = true;
                let current = 0;
                const locationSetterInterval = setInterval(() => {
                    current++;
                    const newUpdateCounterValue= current;
                    setUpdateCounter(newUpdateCounterValue);
                }, 5000);
                
                resourceLock.current = false;

                return () => {
                    clearInterval(locationSetterInterval);
                }
            }
            

            
        })();
    }, []);

    useEffect(()=>{
        Location.getCurrentPositionAsync({})
            .then(location => {
                setLocationEndpoint({
                    clientCode,
                    clientLocation: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    }
                })
            })
            .catch(error =>{
                flashError(error)
            });
        if (huntingActive){
            getLocationOfMatchEndpoint({
                clientCode
            })
        }
    },[updateCounter]);
    return <></>
}

export default LocationProvider;