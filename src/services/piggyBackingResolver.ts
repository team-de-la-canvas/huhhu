import {MatchStartedPiggyBagPayload, ResponsePiggyBag} from "../shared/models";
import {AppDispatch} from "../state/store";
import {flashError} from "./flasher";
import {setMatch} from "../state/huntingSlice";
import {v4 as uuid} from "uuid"

const fetchedBags: uuid = [];
const resolvePiggyBacking = (piggyBag: ResponsePiggyBag, dispatch: AppDispatch) => {
    if (!piggyBag)
        return;
    //dont handle piggyBags twice
    if (uuid.contains(piggyBag.id))
        return;
    
    try {
        switch (piggyBag.type) {
            case "matchStarted":
                let responsePiggyBagPayLoad = piggyBag.payload as MatchStartedPiggyBagPayload
                dispatch(setMatch(responsePiggyBagPayLoad.matchName as string));
                break;
            default:
                flashError("Hey, watch out!","This piggyBag contained something weird!")
                return;
        }
        //no error occurred when resolving piggyBag
        fetchedBags.push(piggyBag.id);
    }
    catch (error){
        flashError("PiggyBacking failed", error)
        
    }
}


export default resolvePiggyBacking;