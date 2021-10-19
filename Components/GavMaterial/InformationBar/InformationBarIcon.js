import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Image, View, Text} from 'react-native';
import themes from '../../../Theme';

const image_unknown = require('./../../../images/questionmark.png');

/**
 * props
 *  iconText (text for the icon)
 *  ?iconImage (image for the icon)
 *  ?iconImageText (use text instead of image)
 *  ?contentOpacity 1 (fades the text/icon) 
 *  ?style (overwrite outer style)
 *  ?onPress (handler for press)
 */
class InformationBarIcon extends Component {
  constructor(props) {
    super(props);

    this.iconText = props.iconText ?? 'iconText'
    this.iconImage = props.iconImage ?? image_unknown
    this.iconImageText = props.iconImageText ?? null
    this.contentOpacity = props.contentOpacity ?? 1
    this.onPress = typeof props.onPress === 'function' ? props.onPress : null

    const passedInStyles = this.props.style ? this.props.style : {}

    this.style = StyleSheet.create({
      outer: {
        flex: 1,
        maxWidth: '25%',
        backgroundColor: themes.main.surface,
        flexDirection: 'column',
        padding: 4,
        ...passedInStyles
      }
    })
  }

  render() {

    console.log('this.contentOpacity', this.contentOpacity);

    return (
      <TouchableOpacity
        onPress={this.onPress}
        style={this.style.outer}>
        
        {/* Show text instead of icon if iconImageText is set */}
        {this.iconImageText && 
          <Text
          style={{
            textAlignVertical: 'center',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 22,
            flex: 1,
            opacity: this.contentOpacity,
          }}
          >{this.iconImageText}</Text>
        }

        {/* otherwise show iconImage */}
        {!this.iconImageText && 
          <Image
          fadeDuration={250}
          style={{
            width: undefined,
            height: undefined,
            flex: 1,
            resizeMode: 'contain',
            opacity: this.contentOpacity,
          }}
          source={this.iconImage}
        />
        }

        {/* iconText */}
        <Text style={{
          flex: 1,
          textAlignVertical: 'center',
          textAlign: 'center',
          fontWeight: 'bold',
          opacity: this.contentOpacity,
        }}>{this.iconText}</Text>
        
      </TouchableOpacity>
    );
  }
}

export default InformationBarIcon;
