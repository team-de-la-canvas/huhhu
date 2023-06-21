import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import { fetchData, updateData, deleteData } from './apiSlice';

interface User {
    id: string;
    name: string;
}

interface UserName {
    id: string;
    firstName: string;
    lastName: string;
}

interface UserState {
    users: User[];
}

const initialState: UserState = {
    users: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, action: PayloadAction<User>) {
            state.users.push(action.payload);
        },
    },
});

export const { addUser } = userSlice.actions;

export const fetchUsers = (): AppThunk => async (dispatch) => {
    dispatch(fetchData('https://example.com/users'));
};


export const updateUsers = (user: User): AppThunk => async (dispatch) => {
    dispatch(updateData({
        url: `https://example.com/users/${user.id}`,
        payload: user,
    }));
};


export const deleteUserApi = (userId: string): AppThunk => async (dispatch) => {
    dispatch(deleteData(`https://example.com/users/${userId}`));
};

export default userSlice.reducer;
