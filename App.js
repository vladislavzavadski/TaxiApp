/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import Root from "./src/main";
import { Provider } from "react-redux";
import { Router, Scene, Actions } from "react-native-router-flux";
import Home from "./src/routes/Home/components/Home";
import MainView from "./src/routes/Home/components/MainView";
import CommentView from "./src/routes/Home/components/Comments";
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import createStore from "./src/store/createStore";
import { NativeRouter, Route, Link } from 'react-router-native'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// type Props = {};
export default class App extends Component {
  render() {
    const store = createStore();

    return (
      <Provider store={store}>
        <NativeRouter>
          <View style={{flex: 1}}>
              <Route exact path="/" component={MainView} />
              <Route path="/comments" component={CommentView} />
            </View>
        </NativeRouter>

      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
