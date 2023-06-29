import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import {getData, updateData, deleteData, postData, postDataAssume} from './apiSlice';
import {RegistrationRequest, RegistrationResponse} from "../shared/routes";
import {FulfilledAction } from "@reduxjs/toolkit/dist/query/core/buildThunks";

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


// export const register = (username: string) : AppThunk => async (dispatch)=> {
//     const response = await dispatch(postData<RegistrationRequest,RegistrationResponse>({
//         url: "http://localhost:3000/reg",
//         payload: {
//             clientName: username
//         }
//     }))as  { payload: RegistrationResponse };
//     const code = response.payload.clientCode;
//     dispatch(setCode(code.toString()));
//     dispatch(setName(username));
//     dispatch(login());
// }

export const register = (username: string) => 
    postDataAssume<RegistrationRequest,RegistrationResponse>({
        url: "http://localhost:3000/reg",
        payload: {
            clientName: username
        },
        successFunction: ({payload,dispatch})=> {
            const code = payload.clientCode;
            dispatch(setCode(code));
            dispatch(setName(username));
            dispatch(login());
        },
        failureFunction: (error) =>{
            console.log("Houston, we've got a problem")
        }
    })


export const login = () : AppThunk => async (dispatch,getState)=> {
    const state = getState();
    dispatch(postData({
        url: "http://localhost:3000/visible",
        payload: {
            clientName: state.auth.name,
            clientCode: state.auth.code,
        }
    }));
    dispatch(setLogin());
}


export default authSlice.reducer;
