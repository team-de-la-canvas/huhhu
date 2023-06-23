export interface Client{
    name : string,
    code: number,
    authenticated?: boolean,
    activeMatchWith?: string
}