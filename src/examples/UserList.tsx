import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../state/userSlice';
import {AppDispatch, RootState} from "../state/store";

function UserList() {
    const dispatch:AppDispatch = useDispatch();
    const users = useSelector((state:RootState) => state.user.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    if (users.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>User List</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
