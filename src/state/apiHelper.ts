import {
    ActionReducerMapBuilder,
    AsyncThunk,
    createAsyncThunk,
    Draft,
    isRejectedWithValue,
    PayloadAction
} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "./store";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {apiUrl} from "./config";
import {callApi} from "./apiSlice";
import {Simulate} from "react-dom/test-utils";

type ThunkParams<Request> = { url: string; payload: Request }

type Callback = {
    onFailure: (error: string) => void,
    onSuccess: () => void
}
export const createApiHook = <RequestType,ResponseType>(urlPath: string,thunk: AsyncThunk<ResponseType,ThunkParams<RequestType>,any>) => {
    return (callback: Callback) => {
        const dispatch:AppDispatch = useDispatch();
        const status = useSelector((state: RootState) => state.auth.apiStates[thunk.typePrefix])
        const [loadingGate,setLoadingGate] = useState(false);

        const [callCompleted, setCallCompleted] = useState(false);

        useEffect(() => {
            if (status.loading) {
                setLoadingGate(true);
            } else if (loadingGate) {
                setCallCompleted(true);
            }

            if (!callCompleted) {
                return;
            }

            if (status.error) {
                callback.onFailure(status.error);
            } else {
                callback.onSuccess();
            }

            setLoadingGate(false);
            setCallCompleted(false);
        }, [status, callback, dispatch]);
        
        
        return (request: RequestType) => dispatch(thunk({
            url: apiUrl+urlPath,
            payload: request
        }))
    };
}

export const createPOSTApiAsyncThunk = <RequestType,ResponseType>(name:string) => {
    return createAsyncThunk<ResponseType, ThunkParams<RequestType>, any>(
        name,
        async (params: ThunkParams<RequestType>) => {
            return callApi(params.url, 'POST', params.payload);
        })
}

type AsyncThunkFulfilledReducer<SliceType,RequestType,ResponseType> = (
    state: Draft<SliceType>, 
    action: PayloadAction<ResponseType, string, {arg: ThunkParams<RequestType>, requestId: string, requestStatus: "fulfilled"}, never>
) => void

type AsyncThunkRejectedReducer<SliceType,RequestType,ResponseType> = (
    state: Draft<SliceType>,
    action:  PayloadAction<unknown, string, ({arg: ThunkParams<RequestType>, requestId: string, requestStatus: "rejected", aborted: boolean, condition: boolean} & {rejectedWithValue: true}) | {arg: ThunkParams<RequestType>, requestId: string, requestStatus: "rejected", aborted: boolean, condition: boolean}, unknown>
) => void

interface ApiState<Response> {
    data: Response | null;
    loading: boolean;
    error: string | null;
}

export type ApiStates = { [path: string]: ApiState<any> }
export const initialApiState: ApiState<any> = {
    data: null,
    loading: false,
    error: null
}
export const createApiBuilder = <SliceType extends { apiStates:ApiStates }> (builder: ActionReducerMapBuilder<SliceType>) => {

    interface ErrorWithMessage {
        message: string;
    }

    function isKnownError(error: unknown): error is ErrorWithMessage {
        return (error as ErrorWithMessage).message !== undefined;
    }
    const addEndpoint = <RequestType,ResponseType>(thunk:  AsyncThunk<ResponseType, ThunkParams<RequestType>, any>, fulfilled: AsyncThunkFulfilledReducer<SliceType,RequestType,ResponseType>,rejected?:AsyncThunkRejectedReducer<SliceType,RequestType,ResponseType>) => {
        builder
            .addCase(thunk.pending, (state, action) => {
                state.apiStates[thunk.typePrefix].loading = true;
            })
            .addCase(thunk.fulfilled, (state, action) => {
                state.apiStates[thunk.typePrefix].loading = false;
                state.apiStates[thunk.typePrefix].error = null;
                state.apiStates[thunk.typePrefix].data = action.payload;
                fulfilled(state,action);
            })
            .addCase(thunk.rejected, (state, action) => {
                state.apiStates[thunk.typePrefix].loading = false;
                if (isKnownError(action.error)) {
                    state.apiStates[thunk.typePrefix].error = action.error.message;
                }
                rejected&&rejected(state, action)
            })
    }
    return {addEndpoint}
}