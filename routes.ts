import {LocationModel} from "./models";

export interface RegistrationRequest {
    clientName: string;
}

export interface RegistrationResponse {
    clientCode: number;
}

export interface LoginRequest {
    clientName: string;
    clientCode: number;
}


export interface LoginResponse {
    message: string;
}


export interface MatchRequest {
    clientCode: number;
}


export interface MatchResponse {
    message: string;
    matchName : string|unknown;
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


export interface SetLocationResponse {
    clientLocation : LocationModel
}
