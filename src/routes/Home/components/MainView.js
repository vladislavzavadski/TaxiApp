import React from "react";
import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const {width, height} = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITIDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITIDE_DELTA * ASPECT_RATIO;

class MainView extends React.Component{


    constructor(props){
        super(props);

        this.state = {
            initialPosition: {
                latitude: 47.6062,
                longitude: 122.3321,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02
            },
            markerPosition: {
                latitude: 47.6062,
                longitude: 122.3321,
            },
            mapReady: false,            
        }
        
    }

    watchId: ?number = null;

    componentDidMount(){
        navigator.geolocation.getCurrentPosition((position)=>{
            var lat = parseFloat(position.coords.latitude);
            var lon = parseFloat(position.coords.longitude);

            var initialRegion = {
                latitude: lat,
                longitude: lon,
                latitudeDelta: LATITIDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }

            this.setState({initialPosition: initialRegion});
            this.setState({markerPosition: initialRegion});
        }, (error) => alert(JSON.stringify(error)), {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});

        this.watchId = navigator.geolocation.watchPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var lon = parseFloat(position.coords.longitude);

            console.log(" " + lat);
            console.log(" " + lon);

            var lastRegion = {
                latitude: lat,
                longitude: lon,
                latitudeDelta: LATITIDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }

            this.setState({initialPosition: lastRegion});
            this.setState({markerPosition: lastRegion});
        })


    }

    componentWillUnmount(){
        navigator.geolocation.clearWatch(this.watchId);
    }

    onMapLayout = () =>{
        
        console.log("wf " + this.state.mapReady);
        this.setState(previousState =>{return {mapReady: true}});
        
    }

    render(){
        return(
            <View style={styles.container}>
                <MapView style={styles.map}
                region={this.state.initialPosition} onLayout={this.onMapLayout}>
                    
                    { this.state.mapReady &&
                    <MapView.Marker coordinate={this.state.markerPosition}>
                        <View style = {styles.radius}>
                            <View style = {styles.marker}>
                            </View>
                        </View>
                    </MapView.Marker>
                    }
                    <MapViewDirections origin = "Minsk"
                        destination="Moscow" apikey = "AIzaSyDf55PAnJldTiGdc8SqV6y_0m4FHQuJ9ls" strokeWidth={3}
                        strokeColor="hotpink">
                    </MapViewDirections>
                </MapView>

                <GooglePlacesAutocomplete
                    
                    query={{
                        key: 'AIzaSyDf55PAnJldTiGdc8SqV6y_0m4FHQuJ9ls',
                        language: 'en', 
                        types: 'geocode' 
                    }}

                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                  }}
                    placeholder='Enter Location'
                    minLength={2}
                    autoFocus={false}
                    returnKeyType={'default'}
                    fetchDetails={true}
                    styles={{
                        textInputContainer: {
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderTopWidth: 0,
                            borderBottomWidth:0
                        },
                        textInput: {
                            marginLeft: 0,
                            marginRight: 0,
                            height: 38,
                            color: '#5d5d5d',
                            fontSize: 16
                        },
                        predefinedPlacesDescription: {
                            color: '#1faadb'
                        },
                    }}
                    currentLocation={true}
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#ddda1f',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    map:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    radius: {
        height: 50,
        width: 50,
        borderRadius: 50/2,
        overflow: "hidden",
        backgroundColor: "rgba(0, 122, 255, 0.1)",
        borderWidth: 1,
        borderColor: "rgba(0, 122, 255, 0.1)",
        alignItems: "center",
        justifyContent: "center"
    },
    marker: {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: "white",
        borderRadius: 20/2,
        overflow: "hidden",
        backgroundColor: "#007AFF"
    },
    input: {
        height: 40,
        width: 220,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 20,
        color: '#FFF',
        paddingHorizontal: 10,

    }
});

export default MainView;