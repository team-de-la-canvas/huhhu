import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import { fetchData, updateData, deleteData } from './apiSlice';

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
        // setUsers: (state, action: PayloadAction<string[]>) => {
        //     state.users = action.payload;
        // },
        // deleteUser(state, action: PayloadAction<string>) {
        //     state.users = state.users.filter(x=>x != action.payload);
        // },
        setMyLocation(state,action: PayloadAction<Location>){
            state.myLocation = action.payload;
        }
    },
});

export const { setMyLocation } = huntingSlice.actions;

// export const fetchUsers = (): AppThunk => async (dispatch) => {
//     const response = await dispatch(fetchData('http://localhost:3000/clients'));
//     const users = response.payload;
//     dispatch(setUsers(users));
// };


// export const updateUsers = (user: User): AppThunk => async (dispatch) => {
//     dispatch(updateData({
//         url: `https://example.com/users/${user.id}`,
//         payload: user,
//     }));
// };


// export const deleteUser = (userId: string): AppThunk => async (dispatch) => {
//     dispatch(deleteData(`https://example.com/users/${userId}`));
// };

export default huntingSlice.reducer;
