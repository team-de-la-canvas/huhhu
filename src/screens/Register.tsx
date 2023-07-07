import React, {useEffect, useState} from "react";
import {Button, SafeAreaView, StyleSheet, Text, TextInput, View} from "react-native";
import {AppDispatch} from "../state/store";
import {flashError, flashSuccess} from "../services/flasher";
import {useRegister} from "../state/authSlice";
// import {useSnackbar} from "notistack";

export default function Register(){
    const register = useRegister({
        onFailure: flashError,
        onSuccess: () => flashSuccess(`Successfully Logged in as ${username}!`)
    });
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
                    <Button onPress={()=>register({
                        clientName: username
                    })} title={"Register"}/>
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
