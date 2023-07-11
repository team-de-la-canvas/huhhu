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
import {LocationModel, MatchCanceledPiggyBagPayload} from "../shared/models";
import {
    ApiStates, ApiStatesState,
    createApiBuilder,
    createApiHook, createHook,
    createPOSTApiAsyncThunk,
    initialApiState
} from "./apiHelper";
import {RootState} from "./store";
import {flashSuccess, flashWarning} from "../services/flasher";
import {useSelector} from "react-redux";

const apiSelector = (state:RootState) => state.hunting

interface HuntingState extends  ApiStatesState {
    myLocation: LocationModel;
    myMockedLocation: LocationModel
    mockedLocation: boolean,
    otherLocation: LocationModel,
    northDegrees: number,
    huntingActive: boolean,
    matchName: string |undefined,
    name: string | null;
    code: number | null;
    visible: boolean;
    registered: boolean;
}

const initialState: HuntingState = {
    myLocation: null,
    myMockedLocation: null, 
    mockedLocation: false,
    otherLocation: null,
    northDegrees: 0,
    huntingActive: false,
    matchName: undefined,
    name: null,
    code: null,
    visible: false,
    registered: false,
    apiStates: {
        match: {...initialApiState},
        setLocation: {...initialApiState},
        getLocationOfMatch: {...initialApiState},
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
        },
        setMockLocation(state, action: PayloadAction<LocationModel>){
            state.myMockedLocation = action.payload;
        },
        enableMockLocation(state){
            state.mockedLocation = true;
        },
        disableMockLocation(state){
            state.mockedLocation = false
        },
        setNorthDegrees(state, action: PayloadAction<number>){
            state.northDegrees = action.payload
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
const useEndpointMatch = createApiHook("/match",match,apiSelector,{})
const useEndpointSetLocation = createApiHook("/setLocation",setLocation,apiSelector,{
    requestPayLoadTransformation: (payload, sliceState) => {
        console.log(sliceState)
        return {
            ...payload,
            clientLocation: sliceState.mockedLocation? sliceState.myMockedLocation: payload.clientLocation
        }
    },
    customSuccess: (dispatch,payload)=> {
        dispatch(huntingSlice.actions.setMyLocation(payload))
    },
    piggyPackingCases:[
        {
            applies: (piggyBag) => piggyBag.type==="matchStarted",
            resolve: (dispatch,piggyBag) => {
                const payload = piggyBag.payload as MatchResponse;
                dispatch(huntingSlice.actions.setMatch(payload))
                flashSuccess("Match Started", `You successfully matched with ${payload.matchName}`)
            }
        },
        {
            applies: piggyBag => piggyBag.type === "matchCanceled",
            resolve: (dispatch,piggyBag) =>{
                const payload = piggyBag.payload as MatchCanceledPiggyBagPayload
                dispatch(huntingSlice.actions.deactivateHunting())
                flashWarning("Match canceled",`${payload.message}`)
            }
        }] 
})
const useEndpointGetLocationOfMatch = createApiHook("/getLocationOfMatch",getLocationOfMatch,apiSelector,{})

const useEndpointVisible = createApiHook("/visible",visible,apiSelector,{});
const useEndpointInvisible = createApiHook("/invisible",invisible,apiSelector, {
    customSuccess: (dispatch) => {
        dispatch(huntingSlice.actions.deactivateHunting())
    }
});
const useEndpointRegister = createApiHook("/reg",register,apiSelector,{});
const useSetMockLocation = createHook(huntingSlice.actions.setMockLocation);
const useEnableMockLocation = createHook(huntingSlice.actions.enableMockLocation);
const useDisableMockLocation = createHook(huntingSlice.actions.disableMockLocation);

const useSetNorthDegrees = createHook(huntingSlice.actions.setNorthDegrees);

type HuntingStateKeySelectorWithoutApiStates = (state: Omit<HuntingState, 'apiStates'>) => any;
export const useHuntingSelector = (selector: HuntingStateKeySelectorWithoutApiStates) =>
    useSelector((root: RootState) => selector(root.hunting));
export default huntingSlice.reducer;

export {
    useEndpointSetLocation,
    useEndpointGetLocationOfMatch,
    useEndpointMatch,
    useEndpointVisible,
    useEndpointInvisible,
    useEndpointRegister,
    useSetMockLocation,
    useEnableMockLocation,
    useDisableMockLocation,
    useSetNorthDegrees
}
