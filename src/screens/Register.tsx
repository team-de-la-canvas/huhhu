import React, {useState} from "react";
import {SafeAreaView, StyleSheet, Text, View} from "react-native";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../state/store";
import { register } from "../state/authSlice";
import {Button, TextInput} from "react-native-paper";
// import {useSnackbar} from "notistack";

export default function Register(){
    const dispatch:AppDispatch = useDispatch();
    const [username, setUserName] = useState("");
    // const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    return(
        <View style={styles.outer}>
            <View style={styles.container}>
                <Text style={styles.title}>Register</Text>
                <View style={styles.stack}>
                    <TextInput id="outlined-basic" label="Username" mode="outlined" onChangeText={text =>{
                        setUserName(text);
                    }}/>
                    <Button mode={"contained"} onPress={()=>{
                        dispatch(register({
                            args: {username},
                            onFailure: console.error
                        }));
                    }}>Register</Button>
                </View>    
            </View>
        </View>
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
        height: 200,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
