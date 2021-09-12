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

const image_sheffield = require('./stands/sheffield.png')

const image_info = require(`./images/bookmark.png`)

class CycleParkingInformationPage extends Component{
 
  constructor(props){
    super(props)

    this.state = {
      showImage: false,
      showModal: false,
      gotBookmark: false
    }

    this.style = StyleSheet.create({
      background: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        // backgroundColor: 'red',
        backgroundColor: themes.main.background,
        flexDirection: 'column'
      },

      iconRow:{
        marginTop: win.h * 0.03,
        // backgroundColor: 'green',
        height: win.h * 0.15,
      
        flexDirection: 'row',
        justifyContent: 'space-evenly'
        
      },

      icon:{

        // flex:1,

        height: '100%',
        aspectRatio: 1,
        backgroundColor: 'blue'
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
    userSettings.get( 'showImage' ).then( data => {
      console.log('userSettings.get( \'showImage\' )', data);
      this.setState({...this.state, showImage: data})
    })

    // which bookmark button to show?
    this.updateBookmarkButton()

  }
  
  updateBookmarkButton(){
    this.isBookmarked( this.props.cyclePark.getId() ).then( bookmark_exists => {
      this.setState({...this.state,
        gotBookmark: true,
        bookmarkExists: bookmark_exists
      })
    })
  }

  onImageErrorHandler(e){
    const error = e.nativeEvent
    console.error('error', error);
    Alert.alert('Error', `Image failed to load`)
  }

  toggleImage(){
    this.state.showImage
      ? this.hideImage()
      : this.showImage()
  }
  showImage(){this.setState({...this.state, showImage: true})}
  hideImage(){this.setState({...this.state, showImage: false})}

  alwaysShowImage(){
    this.showImage()
    userSettings.set( 'showImage', true )
  }
  dontAlwaysShowImage(){
    this.hideImage()
    userSettings.set( 'showImage', false )
  }

  toggleModal(){
    this.setState({...this.state, showModal: !this.state.showModal})
  }

  //TODO check this is working, button isn't changing
  bookmarkButtonOnPress(e){
    const cyclePark = this.props.cyclePark
    const id = cyclePark.getId()
    this.state.bookmarkExists ? this.removeBookmark( id ) : this.addBookmark( id )  
  }

  BookmarkSet( data ){
    return Array.isArray(data) ? new Set(data) : new Set([]);
  }

  async isBookmarked( cyclepark_id ){
    return this.BookmarkSet( await userSettings.get( 'bookmarks' ) ).has( cyclepark_id )
  }

  async removeBookmark ( cyclepark_id ){
    const bookmarksSet = this.BookmarkSet( await userSettings.get( 'bookmarks' ) )
    bookmarksSet.delete( cyclepark_id )
    userSettings.set( 'bookmarks', Array.from( bookmarksSet ) );
    this.updateBookmarkButton()
  }

  async addBookmark( cyclepark_id ){
    const bookmarksSet = this.BookmarkSet( await userSettings.get( 'bookmarks' ) )
    bookmarksSet.add( cyclepark_id )
    userSettings.set( 'bookmarks', Array.from( bookmarksSet ) );
    this.updateBookmarkButton()
  }

  createThreeButtonAlert = () => {
    Alert.alert(
      "Show Image?",
      `${String.fromCodePoint(0x26a0)} Images can use a lot of data\r\naverage ~1.2mb each`,//"Warning: Images can be quite large, average ~1.2mb",
      [
        {
          text: this.state.showImage ? "Hide image" : "Show image",
          onPress: ()=>{ this.toggleImage() }
        },
        {
          text: this.state.showImage ? "Ask to show" : "Always show",
          onPress: ()=>{ this.state.showImage ? this.dontAlwaysShowImage() : this.alwaysShowImage() }
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
      ]
    );
  }

  render(){
    const cyclePark = this.props.cyclePark
    return (
      <View style={this.style.background}>
        <View style={this.style.iconRow}>

          {/* headingText */}
          {/* subHeadingText */}
          {/* backgroundImage */}
          {/* foregroundImage */}

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

          <NiceInformativeIcon
           onPress={()=>{console.log('//TODO show image1!')}}
           headingText={'Picture 1'}
          />
          <NiceInformativeIcon 
            onPress={()=>{console.log('//TODO show image2!')}}
            headingText={'Picture 2'} 
          />

        </View>

        {/* <View style={{flexDirection: 'column'}}>
          <View style={{height: Math.floor(Dimensions.get('window').width / 4), flexDirection: 'row'}}>
            <NiceInformativeIcon />
            <NiceInformativeIcon />
            <NiceInformativeIcon />
            <NiceInformativeIcon />
          </View>
          <View style={{height: '20%', flexDirection: 'row'}}>
            <NiceInformativeIcon />
            <NiceInformativeIcon />
          </View>
        </View> */}

        {/* <Text>Id: {cyclePark.getId()}</Text>
        <Text>Geohash: {cyclePark.getGeohash()}</Text>
        <Text>Lat: {cyclePark.getLat()}</Text>
        <Text>Lon: {cyclePark.getLon()}</Text>
        <Text>Name: {cyclePark.getName()}</Text>
        <Text>Spaces: {cyclePark.getSpaces()}</Text>
        <Text>Type: {cyclePark.getType()}</Text>
        <Text>Picurl: {cyclePark.getPicurl1()}</Text>
        <Text>{cyclePark.isHanger() ? 'is ' : 'is not '} Hanger</Text>
        <Text>{cyclePark.isTiered() ? 'is ' : 'is not '} Tiered</Text>
        <Text>{cyclePark.isLocker() ? 'is ' : 'is not '} Locker</Text>
        <Text>{cyclePark.isSecure() ? 'is ' : 'is not '} Secure</Text>
        <Text>{cyclePark.isCovered() ? 'is ' : 'is not '} Covered</Text>
        <Button
          title="Toggle images"
          onPress={() => {
            this.createThreeButtonAlert();
          }}
        />
        {this.state.showImage && (
          <View style={this.style.imageContainer}>
            <View style={this.style.imageFrame}>
              <Image
                onLoadEnd={() => {
                  console.log(`loaded image: ${cyclePark.getPicurl1()}`);
                }}
                onError={this.onImageErrorHandler}
                style={this.style.image}
                source={{uri: cyclePark.getPicurl1()}}
              />
            </View>
            <View style={this.style.imageFrame}>
              <Image
                onLoadEnd={() => {
                  console.log(`loaded image: ${cyclePark.getPicurl2()}`);
                }}
                onError={this.onImageErrorHandler}
                style={this.style.image}
                source={{uri: cyclePark.getPicurl2()}}
              />
            </View>
          </View>
        )}

        {/* bookmark button */}
        {/*         
        {this.state.gotBookmark && (
          <TouchableOpacity
            style={this.style.bookmarkButton}
            onPress={() => {
              this.bookmarkButtonOnPress();
            }}>
            <Text style={this.style.bookmarkButtonText}>
              {this.state.bookmarkExists ? 'Remove' : 'Bookmark'}
            </Text>
            <Image style={this.style.bookmarkButtonImage} source={image_info} />
          </TouchableOpacity>
        )}  */}
      </View>
    );
  }


}

export default CycleParkingInformationPage