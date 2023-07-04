import {MatchStartedPiggyBagPayload, ResponsePiggyBag} from "../shared/models";
import {AppDispatch} from "../state/store";
import {flashError} from "./flasher";
import {setMatch} from "../state/huntingSlice";

const resolvePiggyBacking = (piggyBag: ResponsePiggyBag, dispatch: AppDispatch) => {
    
    try {
        switch (piggyBag.type) {
            case "matchStarted":
                let responsePiggyBagPayLoad = piggyBag.payload as MatchStartedPiggyBagPayload
                dispatch(setMatch(responsePiggyBagPayLoad.matchName as string));
                break;
            default:
                flashError("Hey, watch out!","This piggyBag contained something weird!")
        }
    }
    catch (error){
        flashError("PiggyBacking failed", error)
        
    }
}


export default resolvePiggyBacking;