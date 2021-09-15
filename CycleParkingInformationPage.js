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

class CycleParkingInformationPage extends Component{
 
  constructor(props){
    super(props)

    this.state = {
      showImageSection: false,
      imageUrl: false,
      cycleParkIsBookmarked: null,
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
    })

    // which bookmark button to show?
    userSettings.get( 'bookmarks' ).then( array => {
      this.updateBookmarkButton( array.indexOf( this.props.cyclePark.getId() ) !== -1 )
    })

  }

  showImage( image_url ){
    this.setState({...this.state, showImageSection: true, imageUrl: image_url})
  }

  openImageSectionToImage( image_url ){

    // check permissions
    userSettings.get('alwaysShowImage').then( value => {
      if(value){
        this.setState({...this.state, showImageSection: true, imageUrl: image_url})
        return
      }

      // Ask permission
      //TODO refactor this
      Alert.alert(
        "Show Image?",
        `${String.fromCodePoint(0x26a0)} images can use a lot of data (approx 1.4mb each).\r\n(this can be changed in the settings page)`,
        [
          {
            text: "Show this time",
            onPress: ()=>{ 
              this.showImage( image_url )
            }
          },
          {
            text: "Always show",
            onPress: ()=>{
              userSettings.set('alwaysShowImage', true)
              this.showImage( image_url )
            }
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
        ]
      );

    })

    
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
  
  BookmarkSet( data ){
    return Array.isArray(data) ? new Set(data) : new Set([]);
  }

  async bookmarkButtonOnPress(){
  
    const cyclepark_id = this.props.cyclePark.getId()
    const bookmarksSet = this.BookmarkSet( await userSettings.get( 'bookmarks' ) )

    // if we already have it, remove it
    let added = null;
    if(bookmarksSet.has( cyclepark_id )){
      bookmarksSet.delete( cyclepark_id )
      added = false
    }else{
      bookmarksSet.add( cyclepark_id )
      added = true
    }

    userSettings.set( 'bookmarks', Array.from( bookmarksSet ) );

    if(this.props.onBookmarksChanged) this.props.onBookmarksChanged()

    this.updateBookmarkButton( added )
  }

  updateBookmarkButton( added ){
    this.setState({...this.state,
      cycleParkIsBookmarked: added
    })
  }

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

          {
            this.state.cycleParkIsBookmarked !== null
            ? <BookmarkInfo
            key={!this.state.cycleParkIsBookmarked ? 'Add' : 'Remove'} // component does not rerender without thi
            subHeadingText={!this.state.cycleParkIsBookmarked ? 'Add' : 'Remove'}
            onPress={()=>{this.bookmarkButtonOnPress()}}
            />
            : <BookmarkInfo
            key={!this.state.cycleParkIsBookmarked ? 'aAdd' : 'aRemove'} // component does not rerender without thi
            subHeadingText={' '}
            onPress={()=>{}}
            />
          }
          
          

        </View>

        {/* image section just covers area */}
        {this.state.showImageSection && this.getImageSection()}

      </View>
    );
  }


}

export default CycleParkingInformationPage