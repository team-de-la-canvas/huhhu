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
import {callApi} from "./apiSlice";
import {v4 as uuid} from "uuid"
import {MatchStartedPiggyBagPayload, ResponsePiggyBag} from "../shared/models";
import {flashError} from "../services/flasher";



type ThunkParams<Request> = { url: string; payload: Request }

type Callback = {
    onFailure: (error: string) => void,
    onSuccess: () => void
}


interface ApiState<Response> {
    data: Response | null;
    loading: boolean;
    error: string | null;
}

export type ApiStates = { [path: string]: ApiState<any> }


const fetchedBags: uuid = [];

type PiggyPackingCase = { 
    applies: (piggyBag: ResponsePiggyBag) => boolean,
    resolve: (dispatch: AppDispatch, piggyBag: ResponsePiggyBag) => void,
}
const usePiggyPacking = (piggyPackingCases:PiggyPackingCase[]) => {
    
    const dispatch:AppDispatch = useDispatch()
    return (piggyBag: ResponsePiggyBag) => {
        
        if (!piggyBag)
            return;
        //dont handle piggyBags twice
        if (uuid.contains(piggyBag.id))
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
export const createApiHook = <RequestType,ResponseType>(urlPath: string,thunk: AsyncThunk<ResponseType,ThunkParams<RequestType>,any>,apiStatesSelector: (state:RootState)=>ApiStates, customSuccess?: ActionCreatorWithOptionalPayload<ResponseType, string>, piggyPackingCases: PiggyPackingCase[] = []) => {
    return (callback: Callback) => {
        const dispatch:AppDispatch = useDispatch();
        const piggyBacking = usePiggyPacking(piggyPackingCases);

        const status = useSelector((state: RootState) => apiStatesSelector(state)[thunk.typePrefix])

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
                if (customSuccess)
                    dispatch(customSuccess(status.data));
                piggyBacking(status.data.piggyBack);
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