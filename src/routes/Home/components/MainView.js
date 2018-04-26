import React from "react";
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from "react-native";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Geocoder from "react-native-geocoder";

const {width, height} = Dimensions.get("window");
const APIKEY = "AIzaSyDf55PAnJldTiGdc8SqV6y_0m4FHQuJ9ls";
const mode = "driving"
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
            destinationSelected: false,
            destinationPlaceId: "",
            padTop: 0,
            route: [],
            distance:{
                text: "",
                value: 0
            },
            duration:{
                text: "",
                value: 0
            }
 
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

    componentWillMount(){
        setTimeout(()=>this.setState({padTop: 1}),500);
        setTimeout(()=>this.setState({padTop: 0}),500);
        console.warn("ok");
    }

    onMapLayout = () =>{
        
        console.log("wf " + this.state.mapReady);
        this.setState(previousState =>{return {mapReady: true}});
        
    }

    destinationWasSelected = (data, details = null) => {
        const getDirectionUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.markerPosition.latitude}%20${this.state.markerPosition.longitude}&destination=place_id:${data.place_id}&key=${APIKEY}&mode=${mode}`;
        console.warn(this.state.markerPosition);
        fetch(getDirectionUrl).
            then(response => response.json()).
            then(responseJson => {
                console.warn(JSON.stringify(responseJson));
                res = this.decode(responseJson.routes[0].overview_polyline.points);
                this.setState({route: res});
                this.setState({destinationSelected: true});
                this.setState({distance: responseJson.routes[0].legs[0].distance});
                this.setState({duration: responseJson.routes[0].legs[0].duration});
            });
        
        this.setState({destinationPlaceId: data.description});
    }

    decode(t,e){
        for(var n,o,u=0,l=0,r=0,d= [],h=0,i=0,a=null,c=Math.pow(10,e||5);u<t.length;){a=null,h=0,i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);n=1&i?~(i>>1):i>>1,h=i=0;do a=t.charCodeAt(u++)-63,i|=(31&a)<<h,h+=5;while(a>=32);o=1&i?~(i>>1):i>>1,l+=n,r+=o,d.push([l/c,r/c])}return d=d.map(function(t){return{latitude:t[0],longitude:t[1]}})}

    render(){
        return(
            <View style={styles.container}>
                <MapView style={styles.map}
                region={this.state.initialPosition} onLayout={this.onMapLayout} showsMyLocationButton={true} 
                followsUserLocation={true}>
                    
                    { this.state.mapReady &&
                    <MapView.Marker coordinate={this.state.markerPosition} >
                        <View style = {styles.radius}>
                            <View style = {styles.currentPositionMarker}>
                            </View>
                        </View>
                    </MapView.Marker>
                    }

                    { this.state.mapReady && this.state.destinationSelected &&
                    <MapView.Marker coordinate={this.state.route[this.state.route.length-1]} >
                        <View style = {styles.radius}>
                            <View style = {styles.destinationPositionMarker}>
                            </View>
                        </View>
                    </MapView.Marker>
                    }

                    {this.state.destinationSelected && 
                    <MapView.Polyline coordinates={this.state.route} strokeWidth={4} strokeColor="red"/>
                    }

                </MapView>

                <GooglePlacesAutocomplete
                    
                    query={{
                        key: APIKEY,
                        language: 'en', 
                        types: 'geocode' 
                    }}

                    onPress={this.destinationWasSelected}
                    placeholder='Enter Location'
                    minLength={2}
                    autoFocus={false}
                    returnKeyType={'default'}
                    fetchDetails={true}
                    styles={{
                        textInputContainer: {
                            backgroundColor: 'rgba(0,0,0,0)',
                            borderTopWidth: 0,
                            borderBottomWidth:0,
                            width: 340
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
                    />


                   {this.state.destinationSelected
                    && <View>
                            <Text>{this.state.distance.text}</Text>
                            <Text>{this.state.duration.text}</Text>
                            <TouchableOpacity style={styles.buttonContainer}>
                                <Text style={styles.buttonText}>Book Taxi</Text>
                            </TouchableOpacity>
                        </View>    
                    
                    }

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
        bottom: 0,
    },
    buttonContainer: {
        backgroundColor: '#ddda1f',
        paddingVertical: 15
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFF',
        fontWeight: '700'
    },
    map:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        
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
    currentPositionMarker: {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: "white",
        borderRadius: 20/2,
        overflow: "hidden",
        backgroundColor: "#007AFF"
    },
    destinationPositionMarker: {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: "white",
        borderRadius: 20/2,
        overflow: "hidden",
        backgroundColor: "#f40000"
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