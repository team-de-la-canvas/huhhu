import {configureStore, ThunkAction, Action, Dispatch, combineReducers, getDefaultMiddleware} from '@reduxjs/toolkit';
import huntingReducer from './huntingSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { persistReducer, persistStore } from 'redux-persist';


// const persistAuthConfig = {
//     key: 'root',
//     storage: AsyncStorage,
//     // whitelist: ["name","code","visible","registered"]
// };

// const defaultMiddleware = getDefaultMiddleware({
//     serializableCheck: false, // turn off check for serializability
// });



// const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);

const store = configureStore({
    reducer: {
        hunting: huntingReducer,
    },
    // middleware: defaultMiddleware
});

// export const persistor = persistStore(store);

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
