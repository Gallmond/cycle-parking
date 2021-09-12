import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, Button, Alert, TouchableOpacity, Dimensions } from 'react-native'
import NiceInformativeIcon from './Components/detailIcons/NiceInformativeIcon'
import userSettings from './UserSettings'

import StandInfo from './Components/detailIcons/StandInfo'
import themes from './Theme'
import SpacesInfo from './Components/detailIcons/SpacesInfo'
import CoveredInfo from './Components/detailIcons/CoveredInfo'
import SecureInfo from './Components/detailIcons/SecureInfo'
import LockerInfo from './Components/detailIcons/LockerInfo'
import TieredInfo from './Components/detailIcons/TieredInfo'
import HangerInfo from './Components/detailIcons/HangerInfo'
import PhotoInfo from './Components/detailIcons/PhotoInfo'
import BookmarkInfo from './Components/detailIcons/BookmarkInfo'

const win = {
  w: Dimensions.get('window').width,
  h: Dimensions.get('window').height,
}

const image_prohibited = require('./images/prohibited.png')
const image_umbrella = require('./images/umbrella.png')
const image_locked = require('./images/locked.png')
const image_locker = require('./images/locker.png')
const image_tiered = require('./images/tiered.png')
const image_hanger = require('./images/hanger.png')
const image_photo = require('./images/photo.png')

const image_sheffield = require('./stands/sheffield.png')

const image_info = require(`./images/bookmark.png`)

class CycleParkingInformationPage extends Component{
 
  constructor(props){
    super(props)

    this.state = {
      showImageSection: false,
      imageUrl: false,
    }

    this.style = StyleSheet.create({
      background: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        backgroundColor: themes.main.background,
        flexDirection: 'column'
      },

      iconRow:{
        marginTop: win.h * 0.03,
        height: win.h * 0.15,
      
        flexDirection: 'row',
        justifyContent: 'space-evenly'
        
      },

      icon:{

        // flex:1,

        height: '100%',
        aspectRatio: 1,
        backgroundColor: 'blue'
      },

      standImageHolder:{
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        backgroundColor: themes.main.secondaryVariant,
        flexDirection: 'column'
      },
      standImageText:{
        flex: 2,
        fontSize: 25,
        color: themes.main.text.onSecondary,
        textAlign: 'center',
        textAlignVertical: 'center',
      },
      standImage:{
        flex: 8,
        resizeMode: 'contain',
        width: '100%',
        height: '100%',
      }



      // imageContainer:{
      //   borderWidth: 5,
      //   borderColor: 'black',
      //   width: '100%',
      //   height: '50%',
      //   flexDirection: 'row'
      // },
      // imageFrame:{
      //   flex: 1,
      // },
      // image:{
      //   resizeMode: 'center',
      //   width: '100%',
      //   height: '100%',
      // },
      // bookmarkButton:{
      //   width: '20%',
      //   aspectRatio: 1,
      //   position: 'absolute',
      //   bottom: 0,
      //   right: 0,
      //   backgroundColor: 'white',
      //   flexDirection: 'column'
      // },
      // bookmarkButtonImage:{
      //   resizeMode: 'center',
      //   width: '100%',
      //   flex: 0.8
      // },
      // bookmarkButtonText:{
      //   textAlign: 'center',
      //   color: 'black',
      //   flex: 0.2
      // },
    })

    


    // check user settings
    // userSettings.get( 'showImage' ).then( data => {
    //   console.log('userSettings.get( \'showImage\' )', data);
    //   this.setState({...this.state, showImage: data})
    // })

    // which bookmark button to show?
    // this.updateBookmarkButton()

  }

  openImageSectionToImage( image_url ){
    this.setState({...this.state, showImageSection: true, imageUrl: image_url})
  }
  closeImageSection(){
    this.setState({...this.state, showImageSection: false})
  }
  getImageSection(){
    const image_url = this.state.imageUrl;
    return (
      <TouchableOpacity 
        activeOpacity={1} // prevent stuttering on tap fadeout as this element is removed
        onPress={()=>{this.closeImageSection()}}
        style={this.style.standImageHolder}>
        <Text style={this.style.standImageText}>Tap anywhere to close</Text>
        <Image
          style={this.style.standImage}
          source={{uri: image_url}}
          onError={e => {Alert.alert('Error', `Image failed to load`)}}
        />
      </TouchableOpacity>
    );

  }
  
  // updateBookmarkButton(){
  //   this.isBookmarked( this.props.cyclePark.getId() ).then( bookmark_exists => {
  //     this.setState({...this.state,
  //       gotBookmark: true,
  //       bookmarkExists: bookmark_exists
  //     })
  //   })
  // }

  // onImageErrorHandler(e){
  //   const error = e.nativeEvent
  //   console.error('error', error);
  //   Alert.alert('Error', `Image failed to load`)
  // }

  // toggleImage(){
  //   this.state.showImage
  //     ? this.hideImage()
  //     : this.showImage()
  // }
  // showImage(){this.setState({...this.state, showImage: true})}
  // hideImage(){this.setState({...this.state, showImage: false})}

  // alwaysShowImage(){
  //   this.showImage()
  //   userSettings.set( 'showImage', true )
  // }
  // dontAlwaysShowImage(){
  //   this.hideImage()
  //   userSettings.set( 'showImage', false )
  // }

  // toggleModal(){
  //   this.setState({...this.state, showModal: !this.state.showModal})
  // }

  // //TODO check this is working, button isn't changing
  // bookmarkButtonOnPress(e){
  //   const cyclePark = this.props.cyclePark
  //   const id = cyclePark.getId()
  //   this.state.bookmarkExists ? this.removeBookmark( id ) : this.addBookmark( id )  
  // }

  // BookmarkSet( data ){
  //   return Array.isArray(data) ? new Set(data) : new Set([]);
  // }

  // async isBookmarked( cyclepark_id ){
  //   return this.BookmarkSet( await userSettings.get( 'bookmarks' ) ).has( cyclepark_id )
  // }

  // async removeBookmark ( cyclepark_id ){
  //   const bookmarksSet = this.BookmarkSet( await userSettings.get( 'bookmarks' ) )
  //   bookmarksSet.delete( cyclepark_id )
  //   userSettings.set( 'bookmarks', Array.from( bookmarksSet ) );
  //   this.updateBookmarkButton()
  // }

  // async addBookmark( cyclepark_id ){
  //   const bookmarksSet = this.BookmarkSet( await userSettings.get( 'bookmarks' ) )
  //   bookmarksSet.add( cyclepark_id )
  //   userSettings.set( 'bookmarks', Array.from( bookmarksSet ) );
  //   this.updateBookmarkButton()
  // }

  // warnUserAboutIm = () => {
  //   Alert.alert(
  //     "Show Image?",
  //     `${String.fromCodePoint(0x26a0)} Images can use a lot of data\r\naverage ~1.2mb each`,//"Warning: Images can be quite large, average ~1.2mb",
  //     [
  //       {
  //         text: this.state.showImage ? "Hide image" : "Show image",
  //         onPress: ()=>{ this.toggleImage() }
  //       },
  //       {
  //         text: this.state.showImage ? "Ask to show" : "Always show",
  //         onPress: ()=>{ this.state.showImage ? this.dontAlwaysShowImage() : this.alwaysShowImage() }
  //       },
  //       {
  //         text: "Cancel",
  //         onPress: () => console.log("Cancel Pressed"),
  //         style: "cancel"
  //       },
  //     ]
  //   );
  // }

  render(){
    const cyclePark = this.props.cyclePark

    return (
      <View style={this.style.background}>
        
        <View style={this.style.iconRow}>
          <StandInfo cyclePark={cyclePark} />
          <SpacesInfo cyclePark={cyclePark} />
        </View>

        <View style={this.style.iconRow}>
          <CoveredInfo cyclePark={cyclePark} />
          <SecureInfo cyclePark={cyclePark} />
          <LockerInfo cyclePark={cyclePark} />
        </View>

        <View style={this.style.iconRow}>
          <TieredInfo cyclePark={cyclePark} />
          <HangerInfo cyclePark={cyclePark} />
        </View>

        <View style={this.style.iconRow}>
          <PhotoInfo
           onPress={()=>{this.openImageSectionToImage( cyclePark.getPicurl1() )}}
          />
          <PhotoInfo 
            onPress={()=>{this.openImageSectionToImage( cyclePark.getPicurl2() )}}
          />

          <BookmarkInfo onPress={()=>{console.log('//TODO bookmark me')}} />

        </View>

        {/* image section just covers area */}
        {this.state.showImageSection && this.getImageSection()}

      </View>
    );
  }


}

export default CycleParkingInformationPage