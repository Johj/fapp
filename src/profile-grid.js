'use strict';

import React, {
  Component,
  Dimensions,
  Image,
  TouchableOpacity
} from 'react-native';

import GridView from 'react-native-grid-view';

const windowSize = Dimensions.get('window');

class ProfileGrid extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }

  componentDidMount() {
    let items = Array.apply(null, Array(this.props.items.length)).map((v, i) => {
      return {id: i, src: this.props.items[i]}
    });
    this.setState({items});
  }

  render() {
    return (
      <GridView
        items = {this.state.items}
        itemsPerRow = {1}
        renderItem = {this.renderItem}
      />
    );
  }

  renderItem(item) {
    return (
      <TouchableOpacity
        key = {item.id}
        style = {{width: windowSize.width / 1, height: windowSize.width / 1, marginTop: 5}}
        onPress = {() => {alert("Pressed image " + item.id);}}>
        <Image
          resizeMode = "cover"
          style = {{flex: 1}}
          source = {{uri: item.src}}
        />
      </TouchableOpacity>
    );
  }

}

module.exports = ProfileGrid;
