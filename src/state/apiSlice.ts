import {createSlice, PayloadAction, createAsyncThunk, AsyncThunk, AsyncThunkAction} from '@reduxjs/toolkit';
import axios, { AxiosResponse, AxiosError } from 'axios';
import {RootState, AppThunk, AppDispatch} from './store';
import {RegistrationRequest, RegistrationResponse} from "../shared/routes";

interface ApiState<T> {
    requestType: string;
    data: T | null;
    loading: boolean;
    error: string | null;
}

const initialState: ApiState<any>[] = [];

const callApi = async (
    url: string,
    method: string,
    payload?: any
): Promise<any> => {
    try {
        const response: AxiosResponse = await axios.request({
            url,
            method,
            data: payload,
        });
        return response.data;
    } catch (error) {
        throw (error as AxiosError).response?.data || error;
    }
};


type BareArgs = {
    dispatch: AppDispatch,
    getState: ()=> RootState
}
type BareFunctionCallback = (args: BareArgs) => void;
export const bare =   (callback: BareFunctionCallback) => async (dispatch,getState) => callback({
    dispatch,
    getState
})

export const getData = createAsyncThunk(
    'api/getData',
    async (url: string) => {
        return callApi(url, 'GET');
    }
);
export type ActionArgs<RequestArgs> = {
    args: RequestArgs,
    onFailure: (error:string) => void
    onSuccess?: () => void
}
type SuccessCallbackArgs<ResponseType> = {
    payload: ResponseType
    dispatch: AppDispatch,
    getState: ()=> RootState
}
type PayloadBuildingArgs = BareArgs;
type FailureCallbackArgs<ResponseType> = {
    error: string
    dispatch: AppDispatch,
    getState: ()=> RootState
}
type CallbackFunction<Args> = (request:Args)=> void;
type BuilderFunction<RequestArgs,ResponseArgs> = (request:RequestArgs)=> ResponseArgs;
type PostRequestArguments<RequestType,ResponseType> = {
    url: string,
    payload: BuilderFunction<PayloadBuildingArgs,RequestType>,
    success: CallbackFunction<SuccessCallbackArgs<ResponseType>>,
    failure: CallbackFunction<FailureCallbackArgs<ResponseType>>,
    requestType: string
}
export const post = <RequestType,ResponseType>(request: PostRequestArguments<RequestType,ResponseType>) =>  async (dispatch, getState)=> {
    dispatch(postData({
        url: request.url,
        payload: request.payload({dispatch,getState}),
        requestType: request.requestType
    }))
    .then(({payload})=> request.success({
        payload,
        dispatch,
        getState
    }))
    .catch((error)=> request.failure({
        getState,
        dispatch,
        error
    }));
}
export const postData = createAsyncThunk<any, {url:string, payload:any,  requestType: string}>(
    'api/postData',
    async <T, AdditionalParam>(params: { url: string; payload: T, requestType:string }) => {
        return callApi(params.url, 'POST', params.payload);
    }
);

export const updateData = createAsyncThunk(
    'api/updateData',
    async <T>(params: { url: string; payload: T }) => {
        return callApi(params.url, 'PUT', params.payload);
    }
);

export const deleteData = createAsyncThunk(
    'api/deleteData',
    async (url: string) => {
        return callApi(url, 'DELETE');
    }
);

const apiSlice = createSlice({
    name: 'api',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // .addCase(getData.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(getData.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.data = action.payload;
            // })
            // .addCase(getData.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message;
            //     state.data = null;
            // })
            .addCase(postData.pending, (state, action) => {
                const { requestType } = action.meta.arg; // Access additional parameter

                // Find the corresponding OneApiState object and update its loading and error fields
                const apiState = state.find((s) => s.requestType === requestType);
                if (apiState) {
                    apiState.loading = true;
                    apiState.error = null;
                    apiState.data = null
                } else {
                    state.push({
                        requestType,
                        loading: true,
                        error: null,
                        data: null
                    })
                }
            })
            .addCase(postData.fulfilled, (state, action) => {
                const { requestType } = action.meta.arg; // Access additional parameter

                // Find the corresponding OneApiState object and update its loading, error, and data fields
                const apiState = state.find((s) => s.requestType === requestType);
                if (apiState) {
                    apiState.loading = false;
                    apiState.error = null;
                    apiState.data = action.payload;
                }
            })
            .addCase(postData.rejected, (state, action) => {
                const { requestType } = action.meta.arg; // Access additional parameter

                // Find the corresponding OneApiState object and update its loading, error, and data fields
                const apiState = state.find((s) => s.requestType === requestType);
                if (apiState) {
                    apiState.loading = false;
                    apiState.error = action.error.message;
                    apiState.data = null;
                }
            })
            // .addCase(updateData.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(updateData.fulfilled, (state) => {
            //     state.loading = false;
            // })
            // .addCase(updateData.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message;
            // })
            // .addCase(deleteData.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(deleteData.fulfilled, (state) => {
            //     state.loading = false;
            // })
            // .addCase(deleteData.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.error.message;
            // });
    },
});

export default apiSlice.reducer;
