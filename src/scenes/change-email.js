'use strict';

import React, {
  Alert,
  Component,
  Text,
  TextInput,
  View,
} from 'react-native';

import Button from '../components/button';
import ButtonStyles from '../styles/button-styles';
import TextStyles from '../styles/text-styles';
import TitleBar from '../components/title-bar';

let database = new Firebase("poopapp1.firebaseio.com");

class ChangeEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      oldEmail: '',
      password: '',
    };
  }

  componentDidMount() {
    this.getEmail();
  }

  render() {
    return (
      <View style = {{flex: 1}}>
        <TitleBar
          hasBack = {"true"}
          navigator = {this.props.navigator}
          text = "Change Your Email"
        />

        <Text style = {{marginTop: 14, marginLeft: 20}}>
          Current Email
        </Text>
        <TextInput
          editable = {false}
          placeholder = {this.state.oldEmail}
          placeholderTextColor = 'black'
          style = {{
            height: 36,
            marginBottom: 32,
            marginLeft: 16,
            marginRight: 16,
          }}
        />

        <TextInput
          keyboardType = 'email-address'
          onChangeText = {(text) => this.setState({email: text})}
          placeholder = {"New Email"}
          placeholderTextColor = 'gray'
          style = {TextStyles.blackTextInput}
          underlineColorAndroid = 'black'
          value = {this.state.email}
          onSubmitEditing = {(event) => {this.refs.Password.focus();}}
        />
        <TextInput
          ref = 'Password'
          onChangeText = {(text) => this.setState({password: text})}
          placeholder = {"Password"}
          placeholderTextColor = 'gray'
          secureTextEntry = {true}
          style = {TextStyles.blackTextInput}
          underlineColorAndroid = 'black'
          value = {this.state.password}
          onSubmitEditing = {() => {this.changeEmail()}}
        />

        <Button
          buttonStyles = {ButtonStyles.transparentButton}
          buttonTextStyles = {ButtonStyles.blackButtonText}
          onPress = {this.changeEmail.bind(this)}
          text = "Submit"
          underlayColor = {'gray'}
        />
      </View>
    );
  }

  getEmail() {
    database.child("users/" + database.getAuth().uid).once("value", (snapshot) => {
        this.setState({
          oldEmail: snapshot.val().email
        });
      }
    );
  }

  changeEmail() {
    if(this.state.email === "") {
      Alert.alert('Error!', 'Enter your new email.');
    } else if(this.state.password === "") {
      Alert.alert('Error!', 'Enter your password.');
    } else if(this.state.oldEmail == this.state.email){
      Alert.alert('Error!', 'The specified email is same as the current email.');
    } else {
      database.changeEmail({
        oldEmail: this.state.oldEmail,
        newEmail: this.state.email,
        password: this.state.password
      }, (error) => {
        if(error) {
          switch(error.code) {
            case "INVALID_PASSWORD":
              Alert.alert('Error!', 'The specified user account password is incorrect.');
              break;
            case "EMAIL_TAKEN":
              Alert.alert('Error!', 'The specified email address is already in use.');
              break;
            case "INVALID_EMAIL":
              Alert.alert('Error!', 'The specified email is not a valid email address.');
              break;
            default:
              Alert.alert('Error!', 'Error changing user email.');
          }
        } else {
          database.child("users/" + database.getAuth().uid).update({email: this.state.email});

          Alert.alert('Success!', 'User email was changed.');
          this.setState({
            email: '',
            oldEmail: this.state.email
          });
        }
      });
    }
    this.setState({
      password: ''
    });
  }
}

module.exports = ChangeEmail;
