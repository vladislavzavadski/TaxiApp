import React from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";

class LoginForm extends React.Component{
    render(){
          return(
             <View style={styles.container}>
                <TextInput placeholder='username' style={styles.input} 
                returnKeyType="next"
                onSubmitEditing={() => this.passwordInput.focus()}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}/>

                <TextInput placeholder='password' secureTextEntry 
                style={styles.input} 
                returnKeyType="go"
                ref = {(input) => this.passwordInput = input}/>
                <TouchableOpacity style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
             </View>
          );
    }
}

const styles = StyleSheet.create({
    container:{
        padding: 20,
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 20,
        color: '#FFF',
        paddingHorizontal: 10,

    },
    buttonContainer: {
        backgroundColor: '#ddda1f',
        paddingVertical: 15
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFF',
        fontWeight: '700'
    }
});

export default LoginForm;