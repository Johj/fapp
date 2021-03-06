'use strict';

import React, {
  Animated,
  Component,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

var ImagePickerManager = require('NativeModules').ImagePickerManager;

class TabBar extends Component{
  propTypes: {
    activeTab: React.PropTypes.number,
    goToPage: React.PropTypes.func,
    tabs: React.PropTypes.array,
  }

  constructor(props) {
    super(props);
    this.state = {
      tabIcons: [],
    }
  }

  render() {
    const tabWidth = this.props.containerWidth / this.props.tabs.length;
    const left = this.props.scrollValue.interpolate({
      inputRange: [0, 1, ],
      outputRange: [0, tabWidth, ],
    });

    return (
      <View>
        <View style = {[styles.tabs, this.props.style]}>
          {this.props.tabs.map((tab, i) => {
            return (
              <TouchableOpacity
                key = {tab}
                onPress = {() => {
                  this.props.goToPage(i)}
                }
                style = {styles.tab}>
                <Icon
                  color = {this.props.activeTab == i ? '#F26D6A' : 'rgb(204,204,204)'}
                  name = {tab}
                  ref = {(icon) => {this.state.tabIcons[i] = icon;}}
                  size = {30}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <Animated.View style = {[styles.tabUnderlineStyle, {width: tabWidth}, {left, }, ]} />
      </View>
    );
  }

  componentDidMount() {
    this.setAnimationValue(this.props.activeTab);
  }

  setAnimationValue(value) {
    this.state.tabIcons.forEach((icon, i) => {
      const progress = (value - i >= 0 && value - i <= 1) ? value - i : 1;
      icon.setNativeProps({
        style: {color: this.iconColor(progress)},
      });
    });
  }

  // color between rgb(59,89,152) and rgb(204,204,204)
  iconColor(progress) {
    const red = 242 + (204 - 242) * progress;
    const green = 109 + (204 - 109) * progress;
    const blue = 106 + (204 - 106) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

}

const styles = StyleSheet.create({
  tab: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: 'black',
    flexDirection: 'row',
    height: 45,
    paddingTop: 5,
  },
  tabUnderlineStyle: {
    backgroundColor: '#F26D6A',
    bottom: 0,
    height: 3,
    position: 'absolute',
  },
});

const options = {
  allowsEditing: false, // Built in functionality to resize, reposition the image after selection
  angle: 0, // android only, photos only
  aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
  aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
  cameraType: 'back', // 'front' or 'back'
  cancelButtonTitle: 'Cancel',
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  durationLimit: 10, // video recording max time in seconds
  title: 'Select Avatar', // specify null or empty string to remove the title
  maxHeight: 370, // photos only
  maxWidth: 370, // photos only
  mediaType: 'photo', // 'photo' or 'video'
  noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
  quality: 1, // 0 to 1, photos only
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  videoQuality: 'high', // 'low', 'medium', or 'high'
};

module.exports = TabBar;
