import {MatchResponse} from "./routes";

export interface Client{
    name : string,
    code: number,
    authenticated?: boolean,
    activeMatchWith?: string,
    location: LocationModel | undefined
}


export interface LocationModel{
    latitude: number,
    longitude: number, 
}

export interface ResponsePiggyBag {
    type: "matchStarted" | "matchCanceled"
    payload: MatchStartedPiggyBagPayload | MatchCanceledPiggyBagPayload
}

export type MatchStartedPiggyBagPayload = MatchResponse

// placeholder
export interface MatchCanceledPiggyBagPayload {

}