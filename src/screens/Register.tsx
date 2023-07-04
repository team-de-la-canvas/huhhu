import React, {useState} from "react";
import {Button, Stack, TextField} from "@mui/material";
import {SafeAreaView, StyleSheet, Text} from "react-native";
import Box from "@mui/material/Box";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../state/store";
import { register } from "../state/authSlice";
// import {useSnackbar} from "notistack";

export default function Register(){
    const dispatch:AppDispatch = useDispatch();
    const [username, setUserName] = useState("");
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    return(
        <SafeAreaView style={styles.outer}>
            <Box style={styles.container}>
                <Text style={styles.title}>Register</Text>
                <Stack style={styles.stack}>
                    <TextField id="outlined-basic" label="Username" variant="outlined" onChange={event =>{
                        setUserName(event.target.value);
                    }}/>
                    <Button onClick={()=>{
                        dispatch(register({
                            args: {username},
                            onFailure: console.error
                        }));
                    }}>Register</Button>
                </Stack>    
            </Box>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    outer: {
        flex: 1
    },
    container: {
        alignSelf: "center",
        backgroundColor: "grey",
        padding: 50,
        flex: 1,
        marginBottom: 250,
        marginTop: 250
    },
    title: {
        alignSelf: "center",
        fontSize: 50
    },
    stack: {
        marginTop: 50,
        justifyContent: "space-between",
        height: 200
    }
});
