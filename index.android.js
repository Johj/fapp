'use strict';

import React, {
  AppRegistry,
  AsyncStorage,
  Component,
  Navigator,
  Text,
  View
} from 'react-native';

import Login from './src/scenes/login';
import Main from './src/scenes/main';

import Header from './src/components/header';

import Firebase from 'firebase';
let app = new Firebase("poopapp1.firebaseio.com");

// reference: http://www.sitepoint.com/authentication-in-react-native-with-firebase/
class PoopApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      component: null,
      loaded: false
    };
  }

  componentWillMount() {
    AsyncStorage.getItem('user_data').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json);
      let component = {component: Login};
      if(user_data != null) {
        app.authWithCustomToken(user_data.token, (error, authData) => {
          if(error) {
            this.setState(component);
          } else {
            this.setState({component: Main});
          }
        });
      } else {
        this.setState(component);
      }
    });
  }

  render() {
    if(this.state.component) {
      return (
        // reference: https://medium.com/@dabit3/react-native-navigator-navigating-like-a-pro-in-react-native-3cb1b6dc1e30#.q5hyx676n
        <Navigator
          initialRoute = {{component: this.state.component}}
          configureScene = {(route, routeStack) => {
            if(route.index === 1) {
              return Navigator.SceneConfigs.FloatFromRight
            } else if(route.index === 2) {
              return Navigator.SceneConfigs.FloatFromLeft
            } else {
              return Navigator.SceneConfigs.FadeAndroid
            }
          }}
          /*
          configureScene = {() => {
            return Navigator.SceneConfigs.FloatFromRight;
          }}
          */
          renderScene = {(route, navigator) => {
            if(route.component) {
              return React.createElement(route.component, {navigator});
            }
          }}
        />
      );
    } else {
      return (
        <View>
          <Header text = "React Native Firebase Auth" loaded = {this.state.loaded}/>
          <View>
          </View>
        </View>
      );
    }
  }
}

AppRegistry.registerComponent('PoopProject', () => PoopApp);
