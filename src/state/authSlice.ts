import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import {getData, updateData, deleteData, postData} from './apiSlice';

interface Identity {
    name: string;
    code: string;
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
        setCode: (state, action: PayloadAction<string>) => {
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

export const register = (username: string) : AppThunk => async (dispatch)=> {
    const response = await dispatch(postData({
        url: "http://localhost:3000/reg",
        payload: {
            clientName: username
        }
    }));
    const code = response.payload.clientCode;
    dispatch(setCode(code));
    dispatch(setName(username));
    dispatch(login());
}

export const login = () : AppThunk => async (dispatch,getState)=> {
    const state = getState();
    dispatch(postData({
        url: "http://localhost:3000/login",
        payload: {
            clientName: state.auth.name,
            clientCode: state.auth.code,
        }
    }));
    dispatch(setLogin());
}


export default authSlice.reducer;
