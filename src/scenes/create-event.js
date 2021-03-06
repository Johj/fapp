'use strict'

import React, {
  Alert,
  AsyncStorage,
  Component,
  DatePickerAndroid,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TimePickerAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Firebase from 'firebase';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import Button from '../components/button';
import TitleBar from '../components/title-bar';
import GridView from '../components/grid-view';

const dateStartStr = 'Pick a Start Date';
const dateEndStr = 'Pick an End Date';
const timeStartStr = 'Pick a Start Time';
const timeEndStr = 'Pick an End Time';

let events = new Firebase("poopapp1.firebaseio.com/events");
let users = new Firebase("poopapp1.firebaseio.com/users");

var ImagePickerManager = require('NativeModules').ImagePickerManager;

const windowSize = Dimensions.get('window');

class CreateEvent extends Component {
  constructor(props) {
    super(props);
    var self = this;
    var loggedUserId;
    var myBlob = [];
    AsyncStorage.getItem('user_data', (error, result) => {
      loggedUserId = JSON.parse(result).uid;

      users.child(loggedUserId + "/friendsList").once("value", function(snapshot) {
        snapshot.forEach(function(friendIdSnapshot) {
          users.child(friendIdSnapshot.val().userId).once("value", function(friendSnapshot){
            let friend = {
              userId: friendSnapshot.key(),
              name: friendSnapshot.val().firstName + " " + friendSnapshot.val().lastName,
              profilePic: friendSnapshot.val().profilePic,
            };
            myBlob.push(friend);
          });
        });
        self.setState({dataSource: myBlob});
      });

      self.setState({
        loggedUser: loggedUserId,
      });
    });
    this.state = {
      dateEnd: dateEndStr,
      dateStart: dateStartStr,
      description: '',
      publicEvent: true,
      timeEnd: timeEndStr,
      timeStart: timeStartStr,
      title: '',
      modalVisible: false,
      invited: [],
      enableScroll: false,
      image: '',
    }
  }

  componentDidMount(){
    this.queryData();
  }

  blah() {
    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if(response.didCancel) {
        console.log('User cancelled image picker');
      } else if(response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      } else {
        // You can display the image using either data:
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        this.setState({
          image: source,
        });
      }
    });
  }

  render() {
    return(
      <ScrollView ref = 'scrollView' keyboardShouldPersistTaps={true} showsVerticalScrollIndicator={this.state.enableScroll} scrollEnabled={this.state.enableScroll} style = {styles.container}>
        {this.renderTitleBar()}
        <View style={{backgroundColor: 'grey', justifyContent:'center', alignItems:'center'}}>
          <TouchableOpacity
            onPress = {()=>this.blah()}
            style={{height: Dimensions.get("window").width/2, width: Dimensions.get("window").width/2,}}
          >
            <Image
              source={this.state.image}
              style={{borderWidth:2, borderColor: 'black', flex:1, height: Dimensions.get("window").width/2, width: Dimensions.get("window").width/2}}
            />
          </TouchableOpacity>
        </View>
        <View style = {{flexDirection: 'row'}}>
          {this.renderTitleInput()}
          {this.renderToggle()}
        </View>
        <View>
          {this.renderDateTimeInput()}
          {this.renderDescriptionInput()}
          {this.renderButtons()}
          <View style={{flexDirection: 'column'}}>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
            <Text>&nbsp;</Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  async showDatePicker(stateKey, options, start) {
    try {
      var newState = {};
      var tempDate = new Date();
      var tempDateStr = tempDate.toLocaleDateString();
      const {action, year, month, day} = await DatePickerAndroid.open(options);

      if(action === DatePickerAndroid.dismissedAction) {
        if(start) {
          tempDateStr = this.state.dateStart;
        } else {
          tempDateStr = this.state.dateEnd;
        }
      } else {
        tempDate = new Date(year, month, day);
        tempDateStr = tempDate.toLocaleDateString();
      }
      if(start) {
        this.setState({dateStart: tempDateStr});
      } else {
        this.setState({dateEnd: tempDateStr});
      }
    } catch({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  }

  async showTimePicker(stateKey, start) {
    var tempMin, tempHour;
    try {
      const {action, minute, hour} = await TimePickerAndroid.open();
      tempMin = minute;
      tempHour = hour;
      var tempTimeStr = '';
      if(action === TimePickerAndroid.dismissedAction) {
        if(start) {
          tempTimeStr = this.state.timeStart;
        } else {
          tempTimeStr = this.state.timeEnd;
        }
      } else if(action === TimePickerAndroid.timeSetAction){
        tempTimeStr = this.formatTime(hour, minute);
      }
      if(start) {
        this.setState({timeStart: tempTimeStr});
      } else {
        this.setState({timeEnd: tempTimeStr});
      }
    } catch({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  }

  formatTime(hour, minute) {
    var str = '';
    var hStr = '';
    var mStr = '';
    var isAM = false;

    if(hour == 0) {
      hStr = 12;
    } else if(hour > 12) {
      hStr = hour - 12;
    } else {
      hStr = hour;
    }

    if(hour < 12 && hour >= 0) {
      isAM = true;
    }
    return hStr + ':' + (minute < 10 ? '0' + minute : minute) + (isAM ? ' am' : ' pm');
  }

  renderTitleBar() {
    return(
      <TitleBar
        hasBack = {true}
        navigator = {this.props.navigator}
        text = "Create an Event"
      />
    );
  }

  renderTitleInput() {
    return (
      <View style = {styles.titleView}>
        <Text style = {styles.smallText}>
          Title
        </Text>
        <TextInput
          onChangeText = {(text) => this.setState({title: text})}
          placeholder = {"Event Title"}
          placeholderTextColor = 'gray'
          style = {styles.titleInput}
          underlineColorAndroid = 'gray'
          value = {this.state.title}
          onEndEditing = {() => {this.setState({enableScroll: false})}}
          onFocus = {() => {setTimeout(() => {this.setState({enableScroll: true})}, 150)}}
        />
      </View>
    );
  }

  renderToggle() {
    return(
      <View style = {styles.visibilityView}>
        <View style = {styles.toggleView}>
          <TouchableOpacity
            onPress = {() => this.setState({publicEvent: true})}
            disabled = {this.state.publicEvent ? true : false}
          >
            <MaterialIcon
              color = {this.state.publicEvent ? '#F26D6A' : 'gray'}
              name = {'public'}
              size = {36}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress = {() => this.setState({publicEvent: false})}
            disabled = {this.state.publicEvent ? false : true}
          >
            <MaterialIcon
              color = {this.state.publicEvent ? 'gray' : '#F26D6A'}
              name = {'group'}
              size = {36}
            />
          </TouchableOpacity>
        </View>
        <Text style = {styles.visibilityText}>
          {this.state.publicEvent ? 'Public Event' : 'Private Event'}
        </Text>
      </View>
    );
  }

  renderDateTimeInput() {
    return (
      <View>
        <View style = {styles.dateView}>
          <Text style = {styles.smallText}>
            From
          </Text>
          <View style = {styles.dateInputView}>
            <View style = {styles.dateInputField}>
              <TouchableWithoutFeedback
                onPress = {
                  this.showDatePicker.bind(this, 'min', {
                    date: this.state.minDate,
                    minDate: new Date(),
                  }, true)
                }>
                <Text style = { [ {color:'gray'}, this.state.dateStart != dateStartStr && {color:'black'} ] }>
                  {this.state.dateStart}
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View style = {styles.dateInputField}>
              <TouchableWithoutFeedback
                onPress = {this.showTimePicker.bind(this, true)}>
                <Text style = { [ {color:'gray'}, this.state.timeStart != timeStartStr && {color:'black'} ] }>
                  {this.state.timeStart}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
        <View style = {styles.dateView}>
          <Text style = {styles.smallText}>
            To
          </Text>
          <View style = {styles.dateInputView}>
            <View style = {styles.dateInputField}>
              <TouchableWithoutFeedback onPress = {
                this.showDatePicker.bind(this, 'min', {
                  date: this.state.minDate,
                  minDate: new Date(this.state.dateStart),
                  }, false )
                }>
                <Text style = { [ {color:'gray'}, this.state.dateEnd != dateEndStr && {color:'black'} ] }>
                  {this.state.dateEnd}
                </Text>
              </TouchableWithoutFeedback>
            </View>
            <View style = {styles.dateInputField}>
              <TouchableWithoutFeedback
                onPress = {this.showTimePicker.bind(this)}>
                <Text style = { [ {color:'gray'}, this.state.timeEnd != timeEndStr && {color:'black'} ] }>
                  {this.state.timeEnd}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderDescriptionInput() {
    var limit = 140;
    var remainder = limit - this.state.description.length;
    var remainderColor = remainder > 5 ? 'gray' : '#B71C1C';

    return (
      <View style = {styles.descriptionView}>
        <Text style = {styles.smallText}>
          Description
        </Text>
        <View style = {styles.descriptionInput}>
          <TextInput
            maxLength = {limit}
            multiline = {true}
            numberOfLines = {3}
            onChangeText = {(text) => this.setState({description: text})}
            placeholder = {"Leave a short description of your event for your guests"}
            placeholderTextColor = 'gray'
            underlineColorAndroid = 'gray'
            value = {this.state.description}
            onEndEditing = {() => {this.setState({enableScroll: false})}}
            onFocus = {() => {setTimeout(() => {this.setState({enableScroll: true})}, 150)}}
          />
          <Text style = {[styles.remainderText, {color: remainderColor}]}>
            {remainder} / {limit}
          </Text>
        </View>
      </View>
    );
  }

  renderButtons() {
    return (
      <View style = {styles.buttonView}>
        <Button
          buttonStyles = {styles.button}
          buttonTextStyles = {styles.buttonText}
          onPress = {() => this.setModalVisible(true)}
          text = "Invite Friends!"
          underlayColor = {"#A2A2A2"}
        />
        <Button
          buttonStyles = {styles.button}
          buttonTextStyles = {styles.buttonText}
          onPress = {this.createEvent.bind(this)}
          text = "Create Event!"
          underlayColor = {"#A2A2A2"}
        />
        <Button
          buttonStyles = {styles.button}
          buttonTextStyles = {styles.buttonText}
          onPress = {this.clearEvent.bind(this)}
          text = "Clear"
          underlayColor = {"#A2A2A2"}
        />
        <Modal
          onRequestClose = {() => {this.setModalVisible(false)}}
          visible = {this.state.modalVisible}>
          <View style = {styles.containerModal}>
            <View style = {styles.modalUserBar}>
              <TouchableOpacity onPress = {() => {this.setModalVisible(false);}}>
                <MaterialIcon
                  borderWidth = {7}
                  color = 'black'
                  name = 'close'
                  size = {25}
                />
              </TouchableOpacity>
            </View>
            <GridView
              dataSource = {this.state.dataSource}
              onRefresh = {this.queryData.bind(this)}
              renderRow = {this.renderRow.bind(this)}
            />
          </View>
        </Modal>
      </View>
    );
  }

  inviteFriend(friend){
    var isIn = false;
    var i = this.state.invited.indexOf(friend.userId);
    if (i != -1){
      isIn = true;
      this.state.invited.splice(i, 1);
    }

    if (!isIn){
      this.state.invited.push(friend.userId);
    }

  }

  getColorFriend(friend){
    var isIn = false;

    if (this.state.invited.indexOf(friend.userId) != -1){
      isIn = true;
    }

    if (isIn){
      return '#F26D6A';
    }
    return 'white';
  }

  renderRow(friend) {
    return (
      <View style = {[styles.friendContainer, {backgroundColor: this.getColorFriend(friend)}]}>
        <TouchableOpacity
          style = {styles.friendTouchView}
          onPress = {() => {
            this.inviteFriend(friend);
            this.forceUpdate();
          }}>
          <Image
            style = {styles.friendUserImage}
            source = {friend.profilePic}
          />
          <View style = {styles.friendNameView}>
            <Text style = {styles.friendName}>
              {friend.name}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  queryData() {
    var myBlob = [];
    var self = this;

    events.child("users/" + self.state.loggedUser + "/friendsList").once("value", function(snapshot) {
      snapshot.forEach(function(friendIdSnapshot) {
        events.child("users/" + friendIdSnapshot.val().userId).once("value", function(friendSnapshot){
          let friend = {
            userId: friendSnapshot.key(),
            name: friendSnapshot.val().firstName + " " + friendSnapshot.val().lastName,
            profilePic: friendSnapshot.val().profilePic,
          };
          myBlob.push(friend);
        });
      });
      self.setState({dataSource: myBlob});
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  createEvent() {
    if( this.state.title === '') {
      Alert.alert('', 'Missing event title');
    } else if( this.state.dateStart == dateStartStr) {
      Alert.alert('', 'Missing start date.');
    } else if( this.state.timeStart === timeStartStr) {
      Alert.alert('', 'Missing start time.');
    } else if( this.state.dateEnd === dateEndStr) {
      Alert.alert('', 'Missing end date.');
    } else if( this.state.timeEnd === timeEndStr) {
      Alert.alert('', 'Missing end time.');
    } else if( this.state.description === '') {
      Alert.alert('', 'Missing event description.');
    } else{
      var eventRef = events.push({
        userID: this.state.loggedUser,
        description: this.state.description,
        endDate: this.state.dateEnd,
        endTime: this.state.timeEnd,
        isPublic: this.state.publicEvent,
        photo: this.state.image === '' ? {uri: 'http://icons.iconarchive.com/icons/graphicloads/food-drink/256/egg-icon.png', isStatic: true} : this.state.image,
        startDate: this.state.dateStart,
        startTime: this.state.timeStart,
        title: this.state.title,
      });

      users.child(this.state.loggedUser + "/eventsList").push({eventId: eventRef.key()});
      for (var i = 0; i < this.state.invited.length; i++){
        users.child(this.state.invited[i] + "/eventsList").push({eventId: eventRef.key()});
        users.child(this.state.invited[i] + "/notifications").push({
          userID: this.state.loggedUser,
          type: "events",
          objectID: eventRef.key(),
          action: "invite",
          textDetails: this.state.title,
        });
      }

      this.props.navigator.pop();
    }
  }

  clearEvent() {
    this.setState({
      description: '',
      dateEnd: dateEndStr,
      dateStart: dateStartStr,
      publicEvent: true,
      timeEnd: timeEndStr,
      timeStart: timeStartStr,
      title: '',
    });
  }
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex:1,
  },
  containerModal: {
    backgroundColor: 'white',
    borderRadius: 5,
    flex: 1,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  smallText: {
    color: '#F26D6A',
    fontSize: 11,
    marginLeft: 5,
  },
  titleView: {
    flex: 3,
  },
  titleInput: {
    height: 32,
    paddingTop: 0,
  },
  dateView: {
    flexDirection: 'column',
  },
  dateInputView: {
    flexDirection: 'row',
  },
  dateInputField: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    padding: 5,
  },
  dateInputText: {
  },
  visibilityView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  toggleView: {
    flexDirection: 'row',
  },
  visibilityToggle: {
  },
  visibilityText: {
    color: 'black',
  },
  descriptionView: {
  },
  descriptionInput: {
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
  },
  remainderText: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  buttonView: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#F26D6A',
    padding: 12,
    margin: 10,
  },
  buttonText: {
    color: 'white',
  },
  modalUserBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 10,
  },
  friendContainer: {
    width: Dimensions.get("window").width,
    borderBottomWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  friendUserImage: {
    width: 25,
    height: 25,
    margin: 10,
  },
  friendTouchView: {
    flexDirection: 'row',
  },
  friendNameView: {
    flex: 1,
    padding: 6,
  },
  friendName: {
  }
});

const options = {
  allowsEditing: false, // Built in functionality to resize, reposition the image after selection
  angle: 0, // android only, photos only
  cameraType: 'front', // 'front' or 'back'
  cancelButtonTitle: 'Cancel',
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  durationLimit: 10, // video recording max time in seconds
  maxHeight: 370, // photos only
  maxWidth: 370, // photos only
  mediaType: 'photo', // 'photo' or 'video'
  noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  quality: 1, // 0 to 1, photos only
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  title: 'Select Avatar', // specify null or empty string to remove the title
  videoQuality: 'high', // 'low', 'medium', or 'high'
};
module.exports = CreateEvent;
