'use strict';

import React, {
  Component,
  Image,
  StyleSheet,
  Text,
  ToolbarAndroid,
  View,
} from 'react-native';

import ImagePickerManager from 'NativeModules';

class Camera extends Component {

  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null,
      test: 'help'
    };
  }

  openCamera() {
    ImagePickerManager.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePickerManager Error: ', response.error);
      } else {
        // You can display the image using either data:
        const source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};
        this.setState({
          avatarSource: source
        });
      }
    });
  }


  renderImage() {
    return (
      <View>
        <ToolbarAndroid
          title = 'Create a Post'
          style = {styles.toolbar}
          actions = {[
            {title: 'Next', show: 'always'},
            {title: 'Camera', show: 'always'},
            {title: 'Home', show: 'always'}
          ]}
          onActionSelected = {this._onActionSelected.bind(this)}
        />
        <Image
          source = {this.state.avatarSource}
          style = {styles.uploadAvatar}
        />
      </View>
    );
  }

  _onActionSelected(position) {
    if (position == 0) {
      alert('Hi');
    } else if (position == 1) {
      this.openCamera();
    }
  }

  render() {
    return this.renderImage();
  }

}

const styles = StyleSheet.create({
  toolbar: {
    height: 56,
    backgroundColor: '#4682b4',
  },
  uploadAvatar: {
    height: 370,
    width: 370,
  }
});

var options = {
  title: 'Select Avatar', // specify null or empty string to remove the title
  cancelButtonTitle: 'Cancel',
  takePhotoButtonTitle: 'Take Photo...', // specify null or empty string to remove this button
  chooseFromLibraryButtonTitle: 'Choose from Library...', // specify null or empty string to remove this button
  cameraType: 'back', // 'front' or 'back'
  mediaType: 'photo', // 'photo' or 'video'
  videoQuality: 'high', // 'low', 'medium', or 'high'
  durationLimit: 10, // video recording max time in seconds
  maxWidth: 370, // photos only
  maxHeight: 370, // photos only
  aspectX: 2, // android only - aspectX:aspectY, the cropping image's ratio of width to height
  aspectY: 1, // android only - aspectX:aspectY, the cropping image's ratio of width to height
  quality: 1, // 0 to 1, photos only
  angle: 0, // android only, photos only
  allowsEditing: false, // Built in functionality to resize, reposition the image after selection
  noData: false, // photos only - disables the base64 `data` field from being generated (greatly improves performance on large photos)
};

module.exports = Camera;
