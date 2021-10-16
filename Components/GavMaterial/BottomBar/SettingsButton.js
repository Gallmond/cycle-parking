import React, {Component} from 'react';
import { View, Image, StyleSheet } from 'react-native';

const image_gear = require('./../../../images/icons/gear.png');

class SettingsButton extends Component {
  constructor(props) {
    super(props);

    this.style = StyleSheet.create({
      icon:{
        height: '100%',
        aspectRatio: 1,

        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      },
      iconImage:{
        width:'50%',
        height:'50%',
        resizeMode: 'stretch',
      }
    });
  }

  render() {
    return (
      <View style={this.style.icon}>
        <Image style={this.style.iconImage} source={image_gear} />
      </View>
    );
  }
}

export default SettingsButton;
