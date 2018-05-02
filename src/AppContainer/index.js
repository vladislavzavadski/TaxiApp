import React, { Component } from "react";
import { Router, Scene } from "react-native-router-flux";
import HomeContainer from "../routes/Home/containers/HomeContainer";
import PropTypes from "prop-types";

// import scenes from "../routes/scenes";

import { Provider } from "react-redux";

export default class AppContainer extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired
	}
	render(){
		return (
			<Provider store={this.props.store}>
				<Router>
					<Scene key="root">
						<Scene key="home" component={HomeContainer}  title="home" initial/>
					</Scene>
				</Router>
			</Provider>
			);
	}
}