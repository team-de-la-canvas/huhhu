import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from '../state/userSlice';
import {AppDispatch, RootState} from "../state/store";
import {Box, List, ListItem, ListItemText} from "@mui/material";
import {Text} from "react-native";


function UserList() {
    const dispatch:AppDispatch = useDispatch();
    const users = useSelector((state:RootState) => state.user.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    if (!users || users.length === 0) {
        return <Box>Loading...</Box>;
    }

    return (
        <Box>
            <Text>User List of lenght: {users.length}</Text>
            <List>
                {users.map(x=>
                    <ListItem key={3}> <ListItemText primary={x} /></ListItem>
                )}
            </List>
        </Box>
    );
}

export default UserList;
