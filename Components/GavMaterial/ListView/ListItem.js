import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import themes from '../../../Theme';

const stands = {
  butterfly: require('./../../../stands/butterfly.png'),
  cyclehoop: require('./../../../stands/cyclehoop.png'),
  mstand: require('./../../../stands/mstand.png'),
  other: require('./../../../stands/other.png'),
  post: require('./../../../stands/post.png'),
  pstand: require('./../../../stands/pstand.png'),
  sheffield: require('./../../../stands/sheffield.png'),
  wheelrack: require('./../../../stands/wheelrack.png'),
};

const image_umbrella = require('./../../../images/umbrella.png');
const image_bookmark = require('./../../../images/bookmark.png');

/**
 * props:
 *  marker
 *  style
 *  onPress
 */
class ListItem extends Component {
  constructor(props) {
    super(props);

    this.marker = props.marker;
    this.onPress = props.onPress;

    const defaultStyles = {
      outer: {
        backgroundColor: themes.main.surface,
        height: 60,

        flexDirection: 'row',
      },
    };

    this.style = StyleSheet.create(defaultStyles);
  }

  getStandImage(standType) {
    const k = standType.toLowerCase().replace(' ','');
    return stands[k] ? stands[k] : null;
  }

  render() {
    const standImage = this.getStandImage(this.marker.cyclepark.getType());

    // format distance string
    let distString = null
    if(this.marker.cyclepark.getDistance()){
      let dist = this.marker.cyclepark.getDistance()
      if(dist < 500){
        distString = `${dist.toFixed()}m`
      }else{
        distString = `${(dist/1000).toFixed(2)}km`
      }
    }

    return (
      <TouchableOpacity 
      style={this.style.outer}
      onPress={()=>{
        this.onPress ? this.onPress(this.marker) : null
      }}
      >
        
        {distString && (
          <View style={{
            marginLeft: 5,
          }}>
            <Text>{distString}</Text>
          </View>
        )}
        
        {/* cycle type icon */}
        <View
          style={{
            marginHorizontal: 5,
            width: 30,
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
            width: 30,
            opacity: this.marker.cyclepark.isCovered() ? 1 : 0.25
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
        <View
          style={{
            // height: '100%',
            // aspectRatio: 1,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: 'bold',
              height: '100%',
              textAlignVertical: 'center',
            }}>
            {this.marker.cyclepark.getSpaces()} spaces
          </Text>
        </View>

        {/* bookmark */}
        <View
          style={{
            position: 'absolute',
            right: 0,
            height: '100%',
            width: 30,
            opacity: this.marker.cyclepark.isBookmark ? 1 : 0.25

          }}>
          <Image
            style={{
              width: undefined,
              height: undefined,
              flex: 1,
              resizeMode: 'contain',
            }}
            source={image_bookmark}
          />
        </View>

      </TouchableOpacity>
    );
  }
}

export default ListItem;
