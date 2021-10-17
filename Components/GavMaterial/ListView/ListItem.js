import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import themes from '../../../Theme';

const stands = {
  'butterfly': require('./../../../stands/butterfly.png'),
  'cyclehoop': require('./../../../stands/cyclehoop.png'),
  'mstand': require('./../../../stands/mstand.png'),
  'other': require('./../../../stands/other.png'),
  'post': require('./../../../stands/post.png'),
  'pstand': require('./../../../stands/pstand.png'),
  'sheffield': require('./../../../stands/sheffield.png'),
  'wheelrack': require('./../../../stands/wheelrack.png'),
}

const image_umbrella = require('./../../../images/umbrella.png')

/**
 * props:
 *  marker
 *  style
 */
class ListItem extends Component {
  
  constructor(props) {
    super(props);

    this.marker = props.marker;

    const defaultStyles = {
      outer:{
        backgroundColor: 'green',
        ...themes.debugHighlight,
        height: 60,

        flexDirection: 'row'
      },

    }

    this.style = StyleSheet.create(defaultStyles)
    
  }

  getStandImage( standType ){
    const k = standType.toLowerCase()
    return stands[k] 
      ? stands[k]
      : null
  }

  render() {

    const standImage = this.getStandImage( this.marker.cyclepark.getType() )

    return (
      <TouchableOpacity style={this.style.outer}>
        
        {/* cycle type icon */}
        <View
          style={{
            marginHorizontal: 5,
            width: 40,
            ...themes.debugHighlight
          }}>
          <Image
            style={{
              width: undefined,
              height: undefined,
              flex: 1,
              resizeMode: 'contain',
            }}
            source={standImage}
          />
        </View>

        {/* umbrella */}
        <View
          style={{
            marginHorizontal: 5,
            width: 40,
            ...themes.debugHighlight
          }}>
          <Image
            style={{
              width: undefined,
              height: undefined,
              flex: 1,
              resizeMode: 'contain',
            }}
            source={image_umbrella}
          />
        </View>

        {/* how many spaces */}
        <View style={{
            // height: '100%',
            // aspectRatio: 1,
            ...themes.debugHighlight,
            alignItems: 'center',
          }}>
          <Text
            style={{
              height: '100%',
              textAlignVertical: 'center'
            }}
          >{this.marker.cyclepark.getSpaces()} spaces</Text>
        </View>


      </TouchableOpacity>
    );
  }
}

export default ListItem;
