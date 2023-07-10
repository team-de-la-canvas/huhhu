import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    GetLocationOfMatchRequest,
    GetLocationOfMatchResponse, InvisibleRequest, InvisibleResponse,
    MatchRequest,
    MatchResponse,
    RegistrationRequest,
    RegistrationResponse,
    SetLocationRequest,
    SetLocationResponse, VisibleRequest, VisibleResponse
} from "../shared/routes";
import {LocationModel} from "../shared/models";
import {
    ApiStates,
    createApiBuilder,
    createApiHook, createHook,
    createPOSTApiAsyncThunk,
    initialApiState
} from "./apiHelper";
import {RootState} from "./store";

const apiStatesSelector = (state:RootState) => state.hunting.apiStates

interface HuntingState {
    myLocation: LocationModel;
    otherLocation: LocationModel,
    huntingActive: boolean,
    matchName: string |undefined,
    name: string | null;
    code: number | null;
    visible: boolean;
    registered: boolean;
    apiStates: ApiStates
}

const initialState: HuntingState = {
    myLocation: null,
    otherLocation: null,
    huntingActive: false,
    matchName: undefined,
    name: null,
    code: null,
    visible: false,
    registered: false,
    apiStates: {
        match: initialApiState,
        setLocation: initialApiState,
        getLocationOfMatch: initialApiState,
        register: {...initialApiState},
        visible: {...initialApiState},
        invisible: {...initialApiState}
    }
};


const match = createPOSTApiAsyncThunk<MatchRequest,MatchResponse>("match")
const setLocation = createPOSTApiAsyncThunk<SetLocationRequest,SetLocationResponse>("setLocation");
const getLocationOfMatch = createPOSTApiAsyncThunk<GetLocationOfMatchRequest,GetLocationOfMatchResponse>("getLocationOfMatch");
const register = createPOSTApiAsyncThunk<RegistrationRequest,RegistrationResponse>("register");
const invisible = createPOSTApiAsyncThunk<InvisibleRequest,InvisibleResponse>("invisible");
const visible = createPOSTApiAsyncThunk<VisibleRequest,VisibleResponse>("visible");



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
            state.huntingActive = true;
        }
    },
    extraReducers: builder => {
        const apiBuilder = createApiBuilder(builder);
        apiBuilder.addEndpoint(match,(state, action) => {
            state.huntingActive = true
        })
        apiBuilder.addEndpoint(setLocation, (state, action)=>{

        })
        apiBuilder.addEndpoint(getLocationOfMatch, (state,action)=>{
            state.otherLocation = action.payload.clientLocation;
        })
        apiBuilder.addEndpoint(register,(state, action)=>{
            state.registered = true;
            state.code = action.payload.clientCode;
        });
        apiBuilder.addEndpoint(invisible,(state, action)=>{
            state.visible = false;
        });
        apiBuilder.addEndpoint(visible, (state, action) => {
            state.visible = true;
        });
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
const useEndpointGetLocationOfMatch = createApiHook("/getLocationOfMatch",getLocationOfMatch,apiStatesSelector)

const useDeactivateHunting = createHook(huntingSlice.actions.deactivateHunting);


const useEndpointVisible = createApiHook("/visible",visible,apiStatesSelector);
const useEndpointInvisible = createApiHook("/invisible",invisible,apiStatesSelector);
const useEndpointRegister = createApiHook("/reg",register,apiStatesSelector);



export default huntingSlice.reducer;

export {useEndpointSetLocation,useEndpointGetLocationOfMatch,useEndpointMatch,useDeactivateHunting,useEndpointVisible,useEndpointInvisible,useEndpointRegister}
