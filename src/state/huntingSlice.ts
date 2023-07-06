import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {ActionArgs, post} from "./apiSlice";
import {
    GetLocationOfMatchRequest, GetLocationOfMatchResponse, MatchRequest, MatchResponse,
    RegistrationRequest,
    RegistrationResponse,
    SetLocationRequest,
    SetLocationResponse
} from "../shared/routes";
import {login} from "./authSlice";
import {LocationModel} from "../shared/models";
import {apiUrl} from "./config";
import piggyBackingResolver from "../services/piggyBackingResolver";

interface HuntingState {
    myLocation: LocationModel;
    otherLocation: LocationModel,
    huntingActive: boolean,
    matchName: string |undefined
}

const initialState: HuntingState = {
    myLocation: null,
    otherLocation: null,
    huntingActive: false,
    matchName: undefined
};

const huntingSlice = createSlice({
    name: 'hunting',
    initialState,
    reducers: {
        // addUser(state, action: PayloadAction<string>) {
        //     state.users.push(action.payload);
        // },
        setMyLocation(state,action: PayloadAction<LocationModel>){
            state.myLocation = action.payload;
        },
        setOtherLocation(state,action: PayloadAction<LocationModel>){
            state.otherLocation = action.payload;
        },
        activateHunting(state){
            state.huntingActive = true
        },
        deactivateHunting(state){
            state.huntingActive = false
        },
        setMatch(state, action: PayloadAction<string>){
            state.matchName = action.payload
        }
    },
});


export const match = ({onFailure, onSuccess }:ActionArgs<{ }>) => post<MatchRequest,MatchResponse>({
    requestType: match.name,
    url: apiUrl+"/match",
    payload: ({getState}) => {
        return {
            clientCode: getState().auth.code
        }
    },
    success: ({payload,dispatch}) => {
        onSuccess();
        dispatch(activateHunting())
    },
    failure: () => onFailure
})


export const pushLocation = ({args,onFailure }:ActionArgs<{  }>) =>
    post<SetLocationRequest,SetLocationResponse>({
        requestType: pushLocation.name,
        url: apiUrl+"/setLocation",
        payload: ({getState})=>({
            clientCode: getState().auth.code,
            clientLocation: getState().hunting.myLocation
        }),
        success: ({payload,dispatch})=> {
            piggyBackingResolver(payload.piggyBack,dispatch);
        },
        failure: (error) => onFailure(error.error)
    })


export const pullLocation = ({args,onFailure }:ActionArgs<{ }>) =>
    post<GetLocationOfMatchRequest,GetLocationOfMatchResponse>({
        requestType: pullLocation.name,
        url: apiUrl+"/getLocationOfMatch",
        payload: ({getState})=>({
            clientCode: getState().auth.code,
        }),
        success: ({payload,dispatch})=> {
            dispatch(setOtherLocation(payload.clientLocation))
        },
        failure: (error) => onFailure(error.error)
    })

export const { setMyLocation,setOtherLocation,activateHunting,deactivateHunting , setMatch} = huntingSlice.actions;

export default huntingSlice.reducer;
