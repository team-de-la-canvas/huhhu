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