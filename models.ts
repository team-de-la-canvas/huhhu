import {MatchResponse} from "./routes";
import {v4 as uuid} from "uuid";

export interface Client{
    name : string,
    code: number,
    visible?: boolean,
    activeMatchWith?: string,
    location: LocationModel | undefined,
    piggyBack?: ResponsePiggyBag
}


export interface LocationModel{
    latitude: number,
    longitude: number, 
}

export interface ResponsePiggyBag {
    type: "matchStarted" | "matchCanceled"
    id: uuid
    payload: MatchStartedPiggyBagPayload | MatchCanceledPiggyBagPayload
}

export type MatchStartedPiggyBagPayload = MatchResponse

// placeholder
export interface MatchCanceledPiggyBagPayload {

}