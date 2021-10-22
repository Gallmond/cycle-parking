import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import themes from '../../../Theme';

/**
 * props
 *  imageOverlay (object with 'visible' and 'sources' props)
 *  onPress
 */
class ImagePopup extends Component {
  constructor(props) {
    super(props);
    this.imageOverlay = props.imageOverlay;
    this.onPress = props.onPress;
  }

  render() {

    const rand = Math.random().toString();

    return (
      <TouchableOpacity
        key={rand}
        onPress={() => {
          this.onPress();
        }}
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: themes.main.background,
          flexDirection: 'column',
        }}>
        {this.imageOverlay.sources.map(src => {
          return (
            <View
              key={src}
              style={{
                flex: 1,
                padding: 5,
              }}>
              <Image
                style={{
                  width: undefined,
                  height: undefined,
                  flex: 1,
                  resizeMode: 'contain',
                }}
                key={src}
                source={{uri: src}}
              />
            </View>
          );
        })}

        {/* floating instruction text */}
        <View
          style={{
            position: 'absolute',
            top: 5,
            width: '100%',
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: 'white',
              fontSize: 35,
              textShadowColor: 'rgba(0, 0, 0, 0.75)',
              textShadowOffset: {width: -1, height: 1},
              textShadowRadius: 50,
            }}>
            Tap anywhere to close
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default ImagePopup;
