'use strict';

import React, {
  Alert,
  AsyncStorage,
  Component,
  Image,
  Navigator,
  Text,
  TextInput,
  View,
} from 'react-native';

import Firebase from 'firebase';

import Button from '../components/button';
import ButtonStyles from '../styles/button-styles';
import Login from './login';
import SceneStyles from '../styles/scene-styles';
import TextStyles from '../styles/text-styles';
import TitleBar from '../components/title-bar';

let database = new Firebase("poopapp1.firebaseio.com");

class Setting extends Component {
  constructor(props) {
    super(props);
    var self = this;

    database.once("value", function(snapshot) {
      var usersnapshot = snapshot.child("users/" + props.state);
      var emailaddress = usersnapshot.val().email;
      self.setState({
        name: usersnapshot.val().firstName + " " + usersnapshot.val().lastName,
        oldEmail: emailaddress,
        profilePic: proPic,
      });
    });

    this.state = {
      email: '',
      name: '',
      oldEmail: '',
      password: '',
      profilePic: '',
    };
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.logout = this.logout.bind(this);
  }

  render() {
    AsyncStorage.getItem('user_data').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json);
      this.setState({
        user: user_data,
      });
    });

    return (
      <View style = {SceneStyles.container}>
        <TitleBar
          hasBack = {true}
          navigator = {this.props.navigator}
          text = "Setting"
        />
        <View>
        {
          this.state.user &&
            <View style = {SceneStyles.container}>
              <Image
                source = {{uri: this.state.profilePic}}
                style = {SceneStyles.image}
              />

              <Text style = {TextStyles.blackText}>
                 {this.state.name}
              </Text>
              <Text style = {TextStyles.blackText}>
                 {this.state.oldEmail}
              </Text>

              <TextInput
                onChangeText = {(text) => this.setState({email: text})}
                placeholder = {"Email"}
                placeholderTextColor = 'black'
                style = {SceneStyles.textInput}
                underlineColorAndroid = 'black'
                value = {this.state.email}
              />

              <Button
                buttonStyles = {ButtonStyles.transparentButton}
                buttonTextStyles = {ButtonStyles.blackButtonText}
                onPress = {this.changeEmail.bind(this)}
                text = "Change Email"
                underlayColor = {"#A2A2A2"}
              />
              <Button
                buttonStyles = {ButtonStyles.transparentButton}
                buttonTextStyles = {ButtonStyles.blackButtonText}
                onPress = {this.changePassword.bind(this)}
                text = "Change Password"
                underlayColor = {"#A2A2A2"}
              />
              <Button
                buttonStyles = {ButtonStyles.transparentButton}
                buttonTextStyles = {ButtonStyles.blackButtonText}
                onPress = {this.logout.bind(this)}
                text = "Logout"
                underlayColor = {"#A2A2A2"}
              />
            </View>
        }
        </View>
      </View>
    );
  }

  changeProfilePicture() {
  }

  changeEmail() {
    database.changeEmail({
      oldEmail: this.state.user.password.email,
      newEmail: this.state.email,
      password: "1"
    }, function(error) {
      if(error) {
        switch(error.code) {
          case "INVALID_PASSWORD":
            Alert.alert('Error!', 'The specified user account password is incorrect.');
            break;
          case "INVALID_USER":
            Alert.alert('Error!', 'The specified user account does not exist.');
            break;
          default:
            Alert.alert('Error!', 'Error creating user.');
        }
      } else {
        Alert.alert('Success!', 'Email has been changed. Please log out and log in again.');
      }
    });
    var ref = database.child("users");
    ref.child(this.state.user.uid).update({
      email: this.state.email
    });
  }

  // TODO
  changePassword() {
    database.changePassword({
      email: this.state.user.password.email,
      oldPassword: "asdf",
      newPassword: "asdf"
      }, function(error) {
        if(error === null) {
          Alert.alert('Success!', 'Password has been changed.');
        } else {
          Alert.alert('Error!', "Could not change password.");
        }
      });
  }

  logout() {
    AsyncStorage.removeItem('user_data').then(() => {
      database.unauth();
    });
  }
}

module.exports = Setting;
