import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView from "react-native-maps";

class Map extends React.Component{
    render(){
        return (
            <View>
                <MapView style={styles.container} region={{
                    latitude: 53.9191041,
                    longitude: 27.5094607,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}>

                </MapView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1
    }
});

export default Map;