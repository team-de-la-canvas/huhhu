import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch, AppThunk, RootState} from './store';
import {getData, updateData, deleteData, postData, post, ActionArgs, callApi} from './apiSlice';
import {InvisibleRequest, InvisibleResponse, RegistrationRequest, RegistrationResponse} from "../shared/routes";
import {FulfilledAction} from "@reduxjs/toolkit/dist/query/core/buildThunks";
import {apiUrl} from "./config";
import {useDispatch, useSelector} from "react-redux";
import Register from "../screens/Register";
import {useEffect, useState} from "react";


interface ApiState<Response> {
    data: Response | null;
    loading: boolean;
    error: string | null;
}

const initialApiState:ApiState<any> = {
    data: null,
    loading: false,
    error: null
};

interface Identity {
    name: string | null;
    code: number | null;
    visible: boolean;
    registered: boolean;
    registration: ApiState<RegistrationResponse>;
    invisible: ApiState<InvisibleResponse>;
}

const initialState: Identity = {
    name: null,
    code: null,
    visible: false,
    registered: false,
    registration: initialApiState,
    invisible: initialApiState
};
type ThunkParams<Request> = { url: string; payload: Request }


const register = createAsyncThunk<RegistrationResponse, ThunkParams<RegistrationRequest>, any>(
    "register",
    async (params: ThunkParams<RegistrationRequest>) => {
        return callApi(params.url, 'POST', params.payload);
    })

type Callback = {
    onFailure: (error: string) => void,
    onSuccess: () => void
}
export const useRegister = (callback: Callback) => {
    const dispatch:AppDispatch = useDispatch();
    const status = useSelector((state: RootState) => state.auth.registration)
    const [loadingGate,setLoadingGate] = useState(false); 
    useEffect(() => {
        if (status.loading)
            setLoadingGate(true);
        if (!loadingGate)
            return;
        if (status.error) {
            callback.onFailure(status.error);
        } else {
            callback.onSuccess()
        }
    }, [status.loading, status.error, callback, dispatch]);
    return (request: RegistrationRequest) => dispatch(register({
        url: apiUrl+"/reg",
        payload: request
    }))
}


const invisible = createAsyncThunk<InvisibleRequest, ThunkParams<InvisibleRequest>, any>(
    "invisible",
    async (params: ThunkParams<InvisibleRequest>) => {
        return callApi(params.url, 'POST', params.payload);
    })
export const useInvisible = (callback: Callback) => {
    const dispatch:AppDispatch = useDispatch();
    const status = useSelector((state: RootState) => state.auth.invisible)
    useEffect(() => {
        if (status.error) {
            callback.onFailure(status.error);
        } else {
            callback.onSuccess()
            dispatch(login())
        }
    }, [status.loading, status.error, callback, dispatch]);
    return (request: InvisibleRequest) => dispatch(invisible({
        url: apiUrl+"/inivsible",
        payload: request
    }))
}

export const login = (): AppThunk => async (dispatch, getState) => {
    const state = getState();
    dispatch(postData({
        requestType: login.name,
        url: apiUrl + "/visible",
        payload: {
            clientName: state.auth.name,
            clientCode: state.auth.code,
        }
    }));
    dispatch(setLogin());
}




const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCode: (state, action: PayloadAction<number>) => {
            state.code = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setLogin: (state) => {
            state.visible = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state, action) => {
                state.registration.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.registration.loading = false;
                state.registration.error = null;
                state.registration.data = action.payload;
                
                state.registered = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.registration.loading = false;
                state.registration.error = action.error.message;
            })

            .addCase(invisible.pending, (state, action) => {
                state.registration.loading = true;
            })
            .addCase(invisible.fulfilled, (state, action) => {
                state.registration.loading = false;
                state.registration.error = null;
                state.registration.data = action.payload;

                state.visible = false;
            })
            .addCase(invisible.rejected, (state, action) => {
                state.registration.loading = false;
                state.registration.error = action.error.message;
            })
    }
});

const {setCode, setName, setLogin} = authSlice.actions;



export default authSlice.reducer;
