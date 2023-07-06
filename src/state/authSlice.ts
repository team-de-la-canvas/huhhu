import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import {getData, updateData, deleteData, postData, post, ActionArgs} from './apiSlice';
import {RegistrationRequest, RegistrationResponse} from "../shared/routes";
import {FulfilledAction } from "@reduxjs/toolkit/dist/query/core/buildThunks";
import {apiUrl} from "./config";

interface Identity {
    name: string;
    code: number;
    loggedIn: boolean;
}


const initialState: Identity = {
    name: null,
    code: null,
    loggedIn: false
};

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
            state.loggedIn = true;
        },
    },
});

const { setCode,setName,setLogin } = authSlice.actions;

type RegisterRequest= {
    username: string
}
export const register = ({args,onFailure, onSuccess }:ActionArgs<RegisterRequest>) => 
    post<RegistrationRequest,RegistrationResponse>({
        requestType: register.name,
        url: apiUrl+"/reg",
        payload: () => ({
            clientName: args.username
        }),
        success: ({payload,dispatch})=> {
            const code = payload.clientCode;
            dispatch(setCode(code));
            dispatch(setName(args.username));
            dispatch(login());
            onSuccess();
        },
        failure: (error) => onFailure(error.error)
    })


export const login = () : AppThunk => async (dispatch,getState)=> {
    const state = getState();
    dispatch(postData({
        requestType: login.name,
        url: apiUrl+"/visible",
        payload: {
            clientName: state.auth.name,
            clientCode: state.auth.code,
        }
    }));
    dispatch(setLogin());
}


export default authSlice.reducer;
