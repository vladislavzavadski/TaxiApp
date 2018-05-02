import React from "react";
import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import { Link } from 'react-router-native';
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
import MapView from "react-native-maps";
import MapViewDirections from "react-native-maps-directions"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Geocoder from "react-native-geocoder";
import { Actions } from "react-native-router-flux";
import driverPhoto from "../../../images/driver.png";
import carIcon from "../../../images/5093-200.png";
import sorryIcon from "../../../images/sorry_emoji_shutterstock.png";
import { setCurrentDriver, setDrivers, setRouteInfo } from "../modules/actionConstants";

const { width, height } = Dimensions.get("window");
const APIKEY = "AIzaSyDf55PAnJldTiGdc8SqV6y_0m4FHQuJ9ls";
const mode = "driving"
const ASPECT_RATIO = width / height;
const LATITIDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITIDE_DELTA * ASPECT_RATIO;

class MainView extends React.Component {

    constructor(props) {
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
            destinationSelected: (this.props.routeInfo && this.props.routeInfo.destinationSelected) ||false,
            destinationPlaceId: "",
            padTop: 0,
            route: (this.props.routeInfo && this.props.routeInfo.route) || [],
            distance: (this.props.routeInfo && this.props.routeInfo.distance) || {
                text: "",
                value: 0
            },
            duration: (this.props.routeInfo && this.props.routeInfo.duration) || {
                text: "",
                value: 0
            },
            isVisible: false,
            drivers: [],
            nearestDriver: {
                car: {},
                location: {}
            },
            routeNotFound:{
                isVisible: false,
                destination: "Vlad",
            },
            dest: ""

        }

    }

    watchId: ?number = null;

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var lon = parseFloat(position.coords.longitude);

            var initialRegion = {
                latitude: lat,
                longitude: lon,
                latitudeDelta: LATITIDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }

            this.setState({ initialPosition: initialRegion });
            this.setState({ markerPosition: initialRegion });
        }, (error) => alert(JSON.stringify(error)), { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });

        this.watchId = navigator.geolocation.watchPosition((position) => {
            var lat = parseFloat(position.coords.latitude);
            var lon = parseFloat(position.coords.longitude);

            var lastRegion = {
                latitude: lat,
                longitude: lon,
                latitudeDelta: LATITIDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            }

            this.setState({ initialPosition: lastRegion });
            this.setState({ markerPosition: lastRegion });
        })


    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
    }

    componentWillMount() {
        setTimeout(() => this.setState({ padTop: 1 }), 500);
        setTimeout(() => this.setState({ padTop: 0 }), 500);
        // console.warn("ok");
    }

    onMapLayout = () => {
        fetch("http://10.0.2.2:8080/drivers").then(response => response.json()).then(response => {
            this.setState({drivers: response}, () => {
                this.props.setDrivers(this.state.drivers);
            });
        });

        this.setState(previousState => { return { mapReady: true } });

    }

    destinationWasSelected = (data, details = null) => {
        const getDirectionUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.markerPosition.latitude}%20${this.state.markerPosition.longitude}&destination=place_id:${data.place_id}&key=${APIKEY}&mode=${mode}`;
        console.warn(JSON.stringify(data));
        fetch(getDirectionUrl).
            then(response => response.json()).
            then(responseJson => {
                console.warn(JSON.stringify(responseJson));
                if(responseJson.status == "OK"){
                    res = this.decode(responseJson.routes[0].overview_polyline.points);

                    this.setState({
                        route: res,
                        destinationSelected: true,
                        distance: responseJson.routes[0].legs[0].distance,
                        duration: responseJson.routes[0].legs[0].duration,
                    }, () => {
                        this.props.setRouteInfo({
                            route: this.state.route,
                            destinationSelected: this.state.destinationSelected,
                            distance: this.state.distance,
                            duration: this.state.duration,
                        });
                    });
                }
                else{
                    this.setState({dest: data.description});
                    this.setState({routeNotFound: {isVisible: true }});
                }
            });
        this.setState({ destinationPlaceId: data.description });
    }

    decode(t, e) {
        for (var n, o, u = 0, l = 0, r = 0, d = [], h = 0, i = 0, a = null, c = Math.pow(10, e || 5); u < t.length;) { a = null, h = 0, i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); n = 1 & i ? ~(i >> 1) : i >> 1, h = i = 0; do a = t.charCodeAt(u++) - 63, i |= (31 & a) << h, h += 5; while (a >= 32); o = 1 & i ? ~(i >> 1) : i >> 1, l += n, r += o, d.push([l / c, r / c]) } return d = d.map(function (t) { return { latitude: t[0], longitude: t[1] } })
    }


    toggleModal = () => {

        fetch(`http://10.0.2.2:8080/drivers/nearest?latitude=${this.state.markerPosition.latitude}&longitude=${this.state.markerPosition.longitude}`).
            then(jsonResponse => jsonResponse.json()).then(response => {
                this.setState({nearestDriver: response}, () => {
                    this.props.setCurrentDriver(this.state.nearestDriver);
                });
            });

        this.setState({
            isVisible: !this.state.isVisible,
        });
    }

    renderModal = () => {
        return (
            <Modal
                isVisible={this.state.isVisible}
                onBackdropPress={() => this.setState({ isVisible: false })}
            >
                <View style={{ flex: 0.6, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <Link
                        to={`/comments`}
                    >
                        <Image
                            style={{ width: 90, height: 90, borderRadius: 45 }}
                            source={driverPhoto}
                        />
                    </Link>
                    <Text style={[styles.textStyles, { fontSize: 18 }]}>{this.state.nearestDriver.name}</Text>
                    <Text style={styles.textStyles}>{this.state.nearestDriver.car.carModel}</Text>
                    <Text style={{ color: '#000', fontSize: 16, padding: 3, borderWidth: 1, borderRadius: 3, textAlign: 'center' }}>{this.state.nearestDriver.car.carNumber}</Text>
                    <TouchableOpacity
                        style={{ margin: 10, padding: 10, backgroundColor: '#ffff00', borderRadius: 5 }}
                        onPress={() => this.setState({ isVisible: false })}
                    >
                        <Text style={{ fontSize: 20, color: '#000', textAlign: 'center' }}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    routeNotFoundModal = () => {
        return (
            <Modal
                isVisible={this.state.routeNotFound.isVisible}
                onBackdropPress={() => this.setState({ routeNotFound: {isVisible: false }})}
            >
                <View style={{ flex: 0.6, padding: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                <Image
                        style={{ width: 200, height: 200, borderRadius: 45 }}
                        source={sorryIcon}
                    />
                    
                    <Text>Sorry, but we can not found route to {this.state.dest} from your current place :(</Text>
                    <TouchableOpacity
                        style={{ margin: 10, padding: 10, backgroundColor: '#ffff00', borderRadius: 5 }}
                        onPress={() => this.setState({ routeNotFound: {isVisible: false } })}
                    >
                        <Text style={{ fontSize: 20, color: '#000', textAlign: 'center' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    <MapView style={styles.map}
                        region={this.state.initialPosition} onLayout={this.onMapLayout} showsMyLocationButton={true}
                        followsUserLocation={true}>

                        {this.state.mapReady &&
                            <MapView.Marker coordinate={this.state.markerPosition}>
                                <View style={styles.radius}>
                                    <View style={styles.currentPositionMarker}>
                                    </View>
                                </View>
                            </MapView.Marker>
                        }

                        {this.state.mapReady && this.state.destinationSelected &&
                            <MapView.Marker coordinate={this.state.route[this.state.route.length - 1]} >
                                <View style={styles.radius}>
                                    <View style={styles.destinationPositionMarker}>
                                    </View>
                                </View>
                            </MapView.Marker>
                        }
                        
                        {this.state.drivers.map(driver => {
                            return (
                                <MapView.Marker key={driver.id} coordinate={driver.location} image={carIcon}         
                                style={{
                                    width: 20,
                                    height: 20
                                  }}/>
                            );
                        })}

                        {this.state.destinationSelected &&
                            <MapView.Polyline coordinates={this.state.route} strokeWidth={4} strokeColor="red" />
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
                                borderBottomWidth: 0,
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

                    {this.state.destinationSelected &&
                    <View style={{ flex: 1, flexDirection: 'row', maxHeight: 60, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.textStyles}>{this.state.distance.text}</Text>
                        <TouchableOpacity
                            style={[{ flex: 0.4 }, styles.buttonContainer]}
                            onPress={this.toggleModal}
                        >
                            <Text style={[{ fontSize: 20 }, styles.buttonText]}>Order Taxi</Text>
                        </TouchableOpacity>
                        <Text style={styles.textStyles}>{this.state.duration.text}</Text>
                    </View>
                    }

                </View>
                {this.renderModal()}
                {this.routeNotFoundModal()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    textStyles: {
        flex: 0.3, fontSize: 16, textAlign: 'center', color: '#000',
    },
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
        backgroundColor: '#ffff00',
        minHeight: 60,
        justifyContent: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: '#000',
        fontWeight: '700'
    },
    map: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,

    },
    radius: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
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
        borderRadius: 20 / 2,
        overflow: "hidden",
        backgroundColor: "#007AFF"
    },
    destinationPositionMarker: {
        height: 20,
        width: 20,
        borderWidth: 3,
        borderColor: "white",
        borderRadius: 20 / 2,
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

const mapStateToProps = (state) => {
    return {
        routeInfo: state.home.routeInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setDrivers: bindActionCreators(setDrivers, dispatch),
        setCurrentDriver: bindActionCreators(setCurrentDriver, dispatch),
        setRouteInfo: bindActionCreators(setRouteInfo, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainView);
