import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {addUser, deleteUser, fetchUsers} from '../state/userSlice';
import {AppDispatch, RootState} from "../state/store";
import {Box, Button, Icon, List, ListItem, ListItemText, TextField} from "@mui/material";
import {Text} from "react-native";
import EditIcon from '@mui/icons-material/Edit';
import RemoveCircleIconOutline from '@mui/icons-material/RemoveCircleOutline';


function UserList() {
    const dispatch:AppDispatch = useDispatch();
    const users = useSelector((state:RootState) => state.user.users);
    
    const [newUsername,setNewUsername] = useState("")

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
                    <ListItem key={3} style={{
                        border: 30,
                        borderColor: "red",
                        backgroundColor: "grey"
                    }}> 
                        <ListItemText primary={x} /> 
                        <EditIcon style={{color:"orange"}}/>
                        <Button onClick={()=>{dispatch(deleteUser(x))}}>
                            <RemoveCircleIconOutline style={{color:"red"}}/>
                        </Button>
                    </ListItem>
                )}
            </List>
            <Box>
                <Text>Lets add one</Text>
                <TextField value={newUsername} onChange={event =>{
                    setNewUsername(event.target.value);
                }}>username</TextField>
                <Button onClick={()=> {
                    dispatch(addUser(newUsername));
                }}>Add New User</Button>
            </Box>
        </Box>
    );
}

export default UserList;
