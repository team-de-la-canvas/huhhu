import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from './store';
import { fetchData, updateData, deleteData } from './apiSlice';

interface User {
    id: string;
    name: string;
}

interface UserState {
    users: string[];
}

const initialState: UserState = {
    users: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, action: PayloadAction<string>) {
            state.users.push(action.payload);
        },
        setUsers: (state, action: PayloadAction<string[]>) => {
            state.users = action.payload;
        },
    },
});

export const { addUser,setUsers } = userSlice.actions;

export const fetchUsers = (): AppThunk => async (dispatch) => {
    const response = await dispatch(fetchData('http://localhost:3000/clients'));
    const users = response.payload;
    dispatch(setUsers(users));
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
