'use strict';

import React, {
  Component,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import ActionButton from 'react-native-action-button';
import Firebase from 'firebase';


import CreateEvent from './create-event';
import EventDetails from './event-details';
import SceneStyles from '../styles/scene-styles'
import TitleBar from '../components/title-bar';

let events = new Firebase("poopapp1.firebaseio.com/events");

class Event extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource: ds.cloneWithRows(["event1", "event2"])
    };
    this.showDetails = this.showDetails.bind(this);
    this.createEvent = this.createEvent.bind(this);
  }

  render() {
    return (
      <View style = {{flex: 1}}>
        <TitleBar
          navigator = {this.props.navigator}
          text = "Events"
        />
        <ListView
          dataSource = {this.state.dataSource}
          renderRow = {(rowData) =>
            <TouchableOpacity onPress = {this.showDetails}>
              <View style = {{flex: 1, height: 50, backgroundColor: 'azure', padding: 10, alignItems: 'center'}}>
                <Text style = {SceneStyles.text}>
                  {rowData}
                </Text>
              </View>
            </TouchableOpacity>
          }
        />
        <ActionButton
          buttonColor = {'#F26D6A'}
          onPress = {this.createEvent}
        />
      </View>
    );
  }

  showDetails(page){
    this.props.navigator.push({component: EventDetails});
  }

  createEvent(){
    this.props.navigator.push({component: CreateEvent});
  }
}

module.exports = Event;
