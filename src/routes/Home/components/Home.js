import React from "react";
import { View, Text, StyleSheet, Image, KeyboardAvoidingView } from "react-native";
import LoginForm from './LoginForm';

class Home extends React.Component{
    render(){
          return(
             <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require("../../../images/taxi-logo.png")}/>
                    <Text style={styles.title}>
                        Taxi Booking App
                    </Text>
                </View>
                <View style={styles.loginContainer}>
                    <LoginForm/>
                </View>    
             </KeyboardAvoidingView>
          );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#3e7fe8'
    },
    logoContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
    },
    logo: {
        width: 100,
        height: 100
    },
    title: {
        color: 'white',
        opacity: 0.9
    }
});

export default Home;