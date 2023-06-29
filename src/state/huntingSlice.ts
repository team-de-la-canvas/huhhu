import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Location {
    latitude: number;
    longitude: number;
}

interface HuntingState {
    myLocation: Location;
    otherLocation: Location
}

const initialState: HuntingState = {
    myLocation: null,
    otherLocation: null
};

const huntingSlice = createSlice({
    name: 'hunting',
    initialState,
    reducers: {
        // addUser(state, action: PayloadAction<string>) {
        //     state.users.push(action.payload);
        // },
        setMyLocation(state,action: PayloadAction<Location>){
            state.myLocation = action.payload;
        }
    },
});

export const { setMyLocation } = huntingSlice.actions;

export default huntingSlice.reducer;
