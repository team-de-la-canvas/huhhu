import {configureStore, ThunkAction, Action, Dispatch} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import huntingReducer from './huntingSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        hunting: huntingReducer
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
