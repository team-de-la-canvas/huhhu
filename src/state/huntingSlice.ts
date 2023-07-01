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

interface HuntingState {
    myLocation: LocationModel;
    otherLocation: LocationModel,
    huntingActive: boolean
}

const initialState: HuntingState = {
    myLocation: null,
    otherLocation: null,
    huntingActive: false,
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
        }
    },
});


export const match = ({onFailure }:ActionArgs<{ }>) => post<MatchRequest,MatchResponse>({
    url: "http://localhost:3000/match",
    payload: ({getState}) => {
        return {
            clientCode: getState().auth.code
        }
    },
    success: ({payload,dispatch}) => {
        dispatch(activateHunting())
        console.log("matched with: ",payload.matchName)
    },
    failure: () => onFailure
})


export const pushLocation = ({args,onFailure }:ActionArgs<{  }>) =>
    post<SetLocationRequest,SetLocationResponse>({
        url: "http://localhost:3000/setLocation",
        payload: ({getState})=>({
            clientCode: getState().auth.code,
            location: getState().hunting.myLocation
        })
        ,
        success: ({payload,dispatch})=> {
            
        },
        failure: (error) => onFailure(error.error)
    })


export const pullLocation = ({args,onFailure }:ActionArgs<{ }>) =>
    post<GetLocationOfMatchRequest,GetLocationOfMatchResponse>({
        url: "http://localhost:3000/getLocationOfMatch",
        payload: ({getState})=>({
            clientCode: getState().auth.code,
        })
        ,
        success: ({payload,dispatch})=> {
            console.log("get location: ",payload.location)
            dispatch(setOtherLocation(payload.location))
        },
        failure: (error) => onFailure(error.error)
    })

export const { setMyLocation,setOtherLocation,activateHunting,deactivateHunting } = huntingSlice.actions;

export default huntingSlice.reducer;
