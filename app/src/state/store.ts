import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import huntingReducer from './huntingSlice';

const store = configureStore({
    reducer: {
        hunting: huntingReducer,
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
