import {createSlice} from '@reduxjs/toolkit';
import {
    InvisibleRequest,
    InvisibleResponse,
    RegistrationRequest,
    RegistrationResponse,
    VisibleRequest, VisibleResponse
} from "../shared/routes";
import {createPOSTApiAsyncThunk, createApiHook, createApiBuilder, ApiStates, initialApiState} from "./apiHelper";
import {RootState} from "./store";

const apiStatesSelector = (state:RootState)=>state.auth.apiStates;

interface Identity {
    name: string | null;
    code: number | null;
    visible: boolean;
    registered: boolean;
    apiStates: ApiStates
}

const initialState: Identity = {
    name: null,
    code: null,
    visible: false,
    registered: false,
    apiStates: {
        register: {...initialApiState},
        visible: {...initialApiState},
        invisible: {...initialApiState}
    }
};


const register = createPOSTApiAsyncThunk<RegistrationRequest,RegistrationResponse>("register");
const invisible = createPOSTApiAsyncThunk<InvisibleRequest,InvisibleResponse>("invisible");
const visible = createPOSTApiAsyncThunk<VisibleRequest,VisibleResponse>("visible");


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const apiBuilder = createApiBuilder(builder);
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

const useEndpointVisible = createApiHook("/visible",visible,apiStatesSelector);
const useEndpointInvisible = createApiHook("/invisible",invisible,apiStatesSelector);
const useEndpointRegister = createApiHook("/reg",register,apiStatesSelector);

export default authSlice.reducer;
export {useEndpointVisible,useEndpointInvisible,useEndpointRegister}