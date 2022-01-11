import React, {Component} from 'react';
import {View, Pressable, Dimensions, Image, Linking} from 'react-native';
import themes from '../../../Theme';
import userSettings from '../../../UserSettings';

const WIN_HEIGHT = Dimensions.get('window').height;
const image_nav_arrow = require('./../../../images/icons/navigation-arrow.png')
const image_bookmark = require('./../../../images/icons/bookmark.png')

/**
 * props
 *  selectedMarker
 *  onBookmarksChanged
 *  isCurrentBookmark
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

  /**
   * toggle the bookmark for the current cyclepark
   * call onBookmarksChanged prop callback if it is set
   */
   toggleBookmarkForCurrentCyclePark(){

    const cyclePark = this.props.selectedMarker.cyclepark
    const cyclepark_id = cyclePark.getId()

    userSettings.get('bookmarks').then( bookmarks =>{

      bookmarks = new Set( Array.isArray(bookmarks) ? bookmarks : [] )

      // if this is already bookmarked, set it. If not, remove it
      bookmarks.has( cyclepark_id )
        ? bookmarks.delete( cyclepark_id )
        : bookmarks.add( cyclepark_id )

      userSettings.set( 'bookmarks', Array.from( bookmarks ) ).then( success => {
        
        if(typeof this.props.onBookmarksChanged === 'function'){
          this.props.onBookmarksChanged( Array.from( bookmarks ) )
        }

      });
    })
  }

  bookmarkButton(){
    const opacity = this.props.isCurrentBookmark
      ? 1
      : 0.3
    return this.getButton(image_bookmark, ()=>{
      console.log('Bookmark button pressed')
      this.toggleBookmarkForCurrentCyclePark()
    },opacity)
  }
  navButton(){
    return this.getButton(image_nav_arrow, ()=>{
      console.log('Nav button pressed')
      this.openGoogleMapsWithDirections()
    })
  }

  getButton(iconImageSource, onPress = null, iconImageOpacity = 1){
    return(
      <Pressable
        onPress={onPress}
        style={{
          flex:1,
          padding: 15
        }}>
          <Image style={{
            opacity: iconImageOpacity,
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
