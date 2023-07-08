import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    GetLocationOfMatchRequest, GetLocationOfMatchResponse, MatchRequest, MatchResponse,
    SetLocationRequest,
    SetLocationResponse
} from "../shared/routes";
import {LocationModel} from "../shared/models";
import {
    ApiStates,
    createApiBuilder,
    createApiHook,
    createPOSTApiAsyncThunk,
    initialApiState
} from "./apiHelper";
import {RootState} from "./store";

const apiStatesSelector = (state:RootState) => state.hunting.apiStates

interface HuntingState {
    myLocation: LocationModel;
    otherLocation: LocationModel,
    huntingActive: boolean,
    matchName: string |undefined
    apiStates: ApiStates
}

const initialState: HuntingState = {
    myLocation: null,
    otherLocation: null,
    huntingActive: false,
    matchName: undefined,
    apiStates: {
        match: initialApiState,
        setLocation: initialApiState,
        getLocationFromMatch: initialApiState
    }
};


const match = createPOSTApiAsyncThunk<MatchRequest,MatchResponse>("match")
const setLocation = createPOSTApiAsyncThunk<SetLocationRequest,SetLocationResponse>("setLocation");
const getLocationFromMatch = createPOSTApiAsyncThunk<GetLocationOfMatchRequest,GetLocationOfMatchResponse>("getLocationFromMatch");

const huntingSlice = createSlice({
    name: 'hunting',
    initialState,
    reducers: {
        setMyLocation(state,action: PayloadAction<SetLocationResponse>){
            state.myLocation = action.payload.clientLocation;
        },
        deactivateHunting(state){
            state.huntingActive = false
        },
        setMatch(state, action: PayloadAction<MatchResponse>){
            state.matchName = action.payload.matchName
        }
    },
    extraReducers: builder => {
        const apiBuilder = createApiBuilder(builder);
        apiBuilder.addEndpoint(match,(state, action) => {
            state.huntingActive = true
        })
        apiBuilder.addEndpoint(setLocation, (state, action)=>{

        })
        apiBuilder.addEndpoint(getLocationFromMatch, (state,action)=>{
            state.otherLocation = action.payload.clientLocation;
        })
    }
});

//Hooks
const useEndpointMatch = createApiHook("/match",match,apiStatesSelector)
const useEndpointSetLocation = createApiHook("/setLocation",setLocation,apiStatesSelector,huntingSlice.actions.setMyLocation,[{
    applies: (piggyBag) => piggyBag.type==="matchStarted",
    resolve: (dispatch,piggyBag) => {
        dispatch(huntingSlice.actions.setMatch(piggyBag.payload as MatchResponse))
    }
}])
const useEndpointGetLocationFromMatch = createApiHook("/getLocationFromMatch",getLocationFromMatch,apiStatesSelector)
export default huntingSlice.reducer;

export {useEndpointSetLocation,useEndpointGetLocationFromMatch,useEndpointMatch}
