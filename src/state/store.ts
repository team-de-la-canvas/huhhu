import {configureStore, ThunkAction, Action, Dispatch} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer
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
