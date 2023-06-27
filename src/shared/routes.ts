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
    matchName : string;
}

export interface ClientsRequest {
    clientCode: number;
}


export interface ClientsResponse {
    message: string;
    clients: string[]
}



export interface MatchesRequest {
    clientCode: number;
}


export interface MatchesResponse {
    message: string;
    matchName : string;
}


export interface GetLocationOfMatchRequest {
    clientCode: number;
}


export interface GetLocationOfMatchResponse {
    location : LocationModel
    matchName : string;
}


export interface SetLocationRequest {
    clientCode: number,
    location : LocationModel
}


export interface SetLocationResponse {
    location : LocationModel
}
