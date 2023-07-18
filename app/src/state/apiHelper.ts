import {
    ActionCreatorWithOptionalPayload,
    ActionReducerMapBuilder,
    AsyncThunk,
    createAsyncThunk,
    Draft,
    PayloadAction
} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "./store";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {apiUrl} from "./config";
import {v4 as uuid} from "uuid"
import {ResponsePiggyBag} from "../shared/models";
import {flashError} from "../services/flasher";
import axios, {AxiosError, AxiosResponse} from "axios";



type ThunkParams<Request> = { url: string; payload: Request }

type Callback = {
    onFailure: (error: string) => void,
    onSuccess?: () => void
}

export type ApiStatesState = {
    apiStates: ApiStates
}

interface ApiState<Response> {
    data: Response | null;
    loading: boolean;
    error: string | null;
}

export type ApiStates = { [path: string]: ApiState<any> }

export const callApi = async (
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

const fetchedBags: uuid[] = [];

type PiggyPackingCase = { 
    applies: (piggyBag: ResponsePiggyBag) => boolean,
    resolve: (dispatch: AppDispatch, piggyBag: ResponsePiggyBag) => void,
}
const usePiggyPacking = (piggyPackingCases:PiggyPackingCase[]):(piggyBag: ResponsePiggyBag)=> void =>  {
    
    const dispatch:AppDispatch = useDispatch()
    if (!piggyPackingCases)
        return ()=> {};
    
    return (piggyBag: ResponsePiggyBag) => {
        
        if (!piggyBag)
            return;
        //dont handle piggyBags twice
        if (fetchedBags.includes(piggyBag.id))
            return;

        try {
            let resolved: boolean = false;
            for (const piggyPackingCase of piggyPackingCases) {
                if (piggyPackingCase.applies(piggyBag)){
                    piggyPackingCase.resolve(dispatch,piggyBag);
                    resolved = true;
                    fetchedBags.push(piggyBag.id);
                    break;
                }
            }
            if (!resolved)
                flashError("Hey, watch out!","This piggyBag contained something weird!")
        }
        catch (error){
            flashError("PiggyBacking failed", error)

        }
    }    
}

export const createHook = <RequestType>(actionCreator: ActionCreatorWithOptionalPayload<RequestType, string>) => {
    return () => {
        const dispatch:AppDispatch = useDispatch();
        return (request:RequestType) => dispatch(actionCreator(request));
    }
}
type SuccessfulPayloadCallback<ResponseType> = (dispatch:AppDispatch, payload: ResponseType) => void

type ApiHookOptions<RequestType,ResponseType,SliceType> = {
    customSuccess?: SuccessfulPayloadCallback<ResponseType>, 
    piggyPackingCases?: PiggyPackingCase[],
    requestPayLoadTransformation?: ((payload:RequestType, sliceState:SliceType) => RequestType) 
}

export const createApiHook = <RequestType,ResponseType, SliceType extends ApiStatesState>(
    urlPath: string,
    thunk: AsyncThunk<ResponseType,ThunkParams<RequestType>,any>,
    apiSelector: (state:RootState)=>SliceType,
    options: ApiHookOptions<RequestType, ResponseType,SliceType>
) => {
    return (callback: Callback) => {
        const dispatch:AppDispatch = useDispatch();
        const piggyBacking = usePiggyPacking(options.piggyPackingCases);

        const status = useSelector((state: RootState) => apiSelector(state).apiStates[thunk.typePrefix])

        const [loadingGate,setLoadingGate] = useState(false);
        const [callCompleted, setCallCompleted] = useState(false);

        const apiState = useSelector((state:RootState)=> apiSelector(state));
        
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
                if (callback.onSuccess)
                    callback.onSuccess();
                if (options.customSuccess)
                    options.customSuccess(dispatch,status.data);
                piggyBacking(status.data.piggyBack);
            }

            setLoadingGate(false);
            setCallCompleted(false);
        }, [status, callback, dispatch]);
        
        
        return (request: RequestType) => dispatch(thunk({
            url: apiUrl+urlPath,
            payload: options.requestPayLoadTransformation?options.requestPayLoadTransformation(request,apiState): request
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
            .addCase(thunk.pending, (state) => {
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