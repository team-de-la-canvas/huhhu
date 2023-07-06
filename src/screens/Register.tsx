import React, {useEffect, useState} from "react";
import {Button, SafeAreaView, StyleSheet, Text, TextInput, View} from "react-native";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../state/store";
import { register } from "../state/authSlice";
import {flashError, flashSuccess} from "../services/flasher";
// import {useSnackbar} from "notistack";

export default function Register(){
    const dispatch:AppDispatch = useDispatch();
    const [username, setUserName] = useState("");
    return(
        <View style={styles.container}>
            <View style={styles.card}>
                <Text>Register & Login</Text>
                <View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={text => setUserName(text)}
                        />
                    </View>
                    <Button onPress={()=>{
                        dispatch(register({
                            args: {username},
                            onFailure: flashError,
                            onSuccess: () => flashSuccess(`Successfully Logged in as ${username}!`)
                        }));
                    }} title={"Register"}/>
                </View>
            </View>
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
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        padding: 8,
        fontSize: 16,
    },
    inputContainer: {
        flex: 1,
        padding: 16,
    },
    inputLabel: {
        marginBottom: 8,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
