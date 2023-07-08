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
import error = Simulate.error;

type ThunkParams<Request> = { url: string; payload: Request }

type Callback = {
    onFailure: (error: string) => void,
    onSuccess: () => void
}
export const createApiHook = <RequestType,ResponseType>(urlPath: string,thunk: AsyncThunk<ResponseType,ThunkParams<RequestType>,any>) => {
    return (callback: Callback) => {
        const dispatch:AppDispatch = useDispatch();
        const status = useSelector((state: RootState) => state.auth.apiStates[urlPath])
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
export const createApiBuilder = <SliceType> (builder: ActionReducerMapBuilder<SliceType>) => {

    interface ErrorWithMessage {
        message: string;
    }

    function isKnownError(error: unknown): error is ErrorWithMessage {
        return (error as ErrorWithMessage).message !== undefined;
    }
    const addEndpoint = <RequestType,ResponseType>(thunk:  AsyncThunk<ResponseType, ThunkParams<RequestType>, any>, fulfilled: AsyncThunkFulfilledReducer<SliceType,RequestType,ResponseType>,rejected?:AsyncThunkRejectedReducer<SliceType,RequestType,ResponseType>) => {
        builder
            .addCase(thunk.pending, (state, action) => {
                state[thunk.typePrefix].loading = true;
            })
            .addCase(thunk.fulfilled, (state, action) => {
                state[thunk.typePrefix].loading = false;
                state[thunk.typePrefix].error = null;
                state[thunk.typePrefix].data = action.payload;
                fulfilled(state,action);
            })
            .addCase(thunk.rejected, (state, action) => {
                state[thunk.typePrefix].loading = false;
                if (isRejectedWithValue(action)) {
                    const error = action.error;

                    if (isKnownError(error)) {
                        state[thunk.typePrefix].error = error.message;
                    }
                }
                rejected(state, action)
            })
    }
    return {addEndpoint}
}