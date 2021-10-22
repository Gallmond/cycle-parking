import React, {Component} from 'react';
import {View, Pressable, Dimensions, Image, Linking} from 'react-native';
import themes from '../../../Theme';

const WIN_HEIGHT = Dimensions.get('window').height;
const image_nav_arrow = require('./../../../images/icons/navigation-arrow.png')
const image_bookmark = require('./../../../images/icons/bookmark.png')

/**
 * props
 *  selectedMarker
 */
class FloatingButtons extends Component {
  constructor(props) {
    super(props);
  }

  openGoogleMapsWithDirections(){
    const query = [
      'api=1',
      'destination=' + encodeURIComponent(`${this.props.selectedMarker.cyclepark.getLat()},${this.props.selectedMarker.cyclepark.getLon()}`),
      'travelmode=bicycling'
    ]
    const gmap_url = 'https://www.google.com/maps/dir/' + '?' + query.join('&')
    Linking.openURL(gmap_url)
  }

  bookmarkButton(){
    return this.getButton(image_bookmark, ()=>{
      console.log('//TODO BOOKMARK')
    })
  }
  navButton(){
    return this.getButton(image_nav_arrow, ()=>{
      this.openGoogleMapsWithDirections()
    })
  }

  getButton(iconImageSource, onPress = null){
    return(
      <Pressable
        onPress={onPress}
        style={{
          flex:1,
          padding: 15
        }}>
          <Image style={{
            width:'100%',
            height:'100%',
            resizeMode: 'stretch'
          }} source={iconImageSource} />
        </Pressable>
    )
  }


  render() {
    return (
      <View
        style={{
          height: Math.floor(WIN_HEIGHT / 10) * 2 - 4,
          aspectRatio: 0.5,
          position: 'absolute',
          right: 0,
          bottom: 0,
          backgroundColor: themes.main.secondaryVariant,
          flexDirection: 'column',
        }}>
          {this.bookmarkButton()}
          {this.navButton()}
        </View>
    );
  }
}

export default FloatingButtons;
