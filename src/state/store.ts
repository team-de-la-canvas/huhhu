import {configureStore, ThunkAction, Action, Dispatch, combineReducers} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import authReducer from './authSlice'
import huntingReducer from './huntingSlice';
import apiReducer from  './apiSlice'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};



const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        user: userReducer,
        hunting: huntingReducer,
        api: apiReducer,
    }
});

export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
