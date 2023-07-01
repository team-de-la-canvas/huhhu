import {configureStore, ThunkAction, Action, Dispatch} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice'
import huntingReducer from './huntingSlice';
import apiReducer from  './apiSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        hunting: huntingReducer,
        auth: authReducer,
        api: apiReducer
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
