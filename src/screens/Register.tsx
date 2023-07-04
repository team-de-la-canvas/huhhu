import React, {useEffect, useState} from "react";
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../state/store";
import { register } from "../state/authSlice";
import {Button, Card, TextInput} from "react-native-paper";
import {flashError} from "../services/flasher";
// import {useSnackbar} from "notistack";

export default function Register(){
    const dispatch:AppDispatch = useDispatch();
    const [username, setUserName] = useState("");
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    useEffect(()=>{
        flashError("test")
    },[]);
    return(
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Register & Login" />
                <Card.Content>
                    <TextInput style={styles.input} id="outlined-basic" label="Username" mode="outlined" onChangeText={text =>{
                        setUserName(text);
                    }}/>
                    <Button mode={"contained"} style={styles.button} onPress={()=>{
                        dispatch(register({
                            args: {username},
                            onFailure: flashError
                        }));
                    }}>Register</Button>
                </Card.Content>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '80%',
        padding: 16,
    },
    button: {
        marginTop: 16,
    },
    input: {
        marginBottom: 16,
    },
});
