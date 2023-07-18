import {ResponsePiggyBag, LocationModel} from "./models";

export interface PiggyPackingResponse {
    piggyBack: ResponsePiggyBag
}

export interface RegistrationRequest {
    clientName: string;
}

export interface RegistrationResponse {
    clientCode: number;
}

export interface VisibleRequest {
    clientCode: number;
}


export interface VisibleResponse {
    message: string;
}


export interface InvisibleRequest {
    clientCode: number;
}


export interface InvisibleResponse {
    message: string;
}


export interface MatchRequest {
    clientCode: number;
}


export interface MatchResponse {
    message: string;
    matchName : string;
}

export interface CancelMatchRequest {
    clientCode: number;
}


export interface CancelMatchResponse {
    message: string;
}

export interface ClientsRequest {
    clientCode: number;
}


export interface ClientsResponse {
    clients: string[]
}



export interface MatchesRequest {
    clientCode: number;
}


export interface MatchesResponse {
    matches : string[][];
}


export interface GetLocationOfMatchRequest {
    clientCode: number;
}


export interface GetLocationOfMatchResponse {
    clientLocation : LocationModel
    matchName : string;
}


export interface SetLocationRequest {
    clientCode: number,
    clientLocation : LocationModel
}


export interface SetLocationResponse extends PiggyPackingResponse {
    clientLocation : LocationModel
}
