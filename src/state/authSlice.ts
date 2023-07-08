import {createSlice} from '@reduxjs/toolkit';
import {
    InvisibleRequest,
    InvisibleResponse,
    RegistrationRequest,
    RegistrationResponse,
    VisibleRequest, VisibleResponse
} from "../shared/routes";
import {createPOSTApiAsyncThunk, createApiHook, createApiBuilder, ApiStates, initialApiState} from "./apiHelper";


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
export const useRegister = createApiHook("/reg",register);

const invisible = createPOSTApiAsyncThunk<InvisibleRequest,InvisibleResponse>("invisible");
export const useInvisible = createApiHook("/invisible",invisible);

const visible = createPOSTApiAsyncThunk<VisibleRequest,VisibleResponse>("visible");
export const useVisible = createApiHook("/visible",visible);


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

export default authSlice.reducer;
