'use strict';

import React, {
  Alert,
  AsyncStorage,
  Component,
  ListView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import Share from 'react-native-share';

import Button from '../components/button';
import TextStyles from '../styles/text-styles';
import TitleBar from '../components/title-bar';

let database = new Firebase("poopapp1.firebaseio.com/");
let userdata = new Firebase("poopapp1.firebaseio.com/events");
class Notification extends Component {
  constructor(props) {
    super(props);
    /*const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });*/
    this.state = {
      /*dataSource: ds.cloneWithRows([
        'You have 1 new follower: tester',
        'You followed tester'
      ])*/
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    };
  }

  componentDidMount() {
    var notes = [];
    userdata.on('child_removed', function (snap){
      alert ("child removed");
      notes.push("remove!");
    });
    var newItems = false;
    userdata.on('child_added',function (snap){
      if(!newItems) return;
      alert ("child added");
      notes.push("add!");
    });
    userdata.once('value', function(snap){
      newItems = true;
    });
    userdata.on('child_changed',function (snap){
      alert ("child changed");
      notes.push("change! impossible! haven't implemented yet!");
    });
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(notes)
    });
  }

  render() {
    return (
      <View style = {{flex: 1}}>
        <TitleBar
          navigator = {this.props.navigator}
          text = "Notification"
        />
        <View style = {{flex:1, backgroundColor: 'white'}}>
        <ListView
          dataSource = {this.state.dataSource}
          renderRow = {(rowData) =>
            <TouchableOpacity onPress = {this.generate} underlayColor = 'lemonchiffon'>
              <View style = {{flex: 1, height: 50, backgroundColor: 'azure', padding: 10, alignItems: 'center'}}>
                <Text style = {TextStyles.text}>
                  {rowData}
                </Text>
              </View>
            </TouchableOpacity>
          }
        />
        </View>
      </View>
    );
  }

  following(){
  }

  posts(){
  }

  events(){
  }

}

module.exports = Notification;
