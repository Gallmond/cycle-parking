import React, { Component } from 'react'
import { Text, StyleSheet, View, Image, Button, Alert, AppState } from 'react-native'
import userSettings from './UserSettings'

class CycleParkingInformationPage extends Component{
 
  constructor(props){
    super(props)

    this.state = {
      showImage: false,
      showModal: false
    }

    this.style = StyleSheet.create({
      background: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        backgroundColor: 'red'
      },
      imageContainer:{
        borderWidth: 5,
        borderColor: 'black',
        width: '50%',
        height: undefined,
        aspectRatio: 1
      },
      image:{
        resizeMode: 'center',
        width: '100%',
        height: '100%',
      },
    })

    // check user settings
    userSettings.get( 'showImage' ).then( data => {
      console.log('userSettings.get( \'showImage\' )', data);
      this.setState({...this.state, showImage: data})
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
    return(
      <View style={this.style.background}>
        <Text>Id: {cyclePark.getId()}</Text>
        <Text>Geohash: {cyclePark.getGeohash()}</Text>
        <Text>Lat: {cyclePark.getLat()}</Text>
        <Text>Lon: {cyclePark.getLon()}</Text>
        <Text>Name: {cyclePark.getName()}</Text>
        <Text>Spaces: {cyclePark.getSpaces()}</Text>
        <Text>Type: {cyclePark.getType()}</Text>
        <Text>Picurl: {cyclePark.getPicurl()}</Text>
        <Text>{cyclePark.isHanger() ? 'is ' : 'is not '} Hanger</Text>
        <Text>{cyclePark.isTiered() ? 'is ' : 'is not '} Tiered</Text>
        <Text>{cyclePark.isLocker() ? 'is ' : 'is not '} Locker</Text>
        <Text>{cyclePark.isSecure() ? 'is ' : 'is not '} Secure</Text>
        <Text>{cyclePark.isCovered() ? 'is ' : 'is not '} Covered</Text>
        <Button title="Toggle image" onPress={()=>{this.createThreeButtonAlert()}} />
        {
          this.state.showImage 
          && <View style={this.style.imageContainer} >
              <Image 
                onLoadEnd={()=>{console.log(`loaded image: ${cyclePark.getPicurl()}`)}}
                onError={this.onImageErrorHandler} 
                style={this.style.image} 
                source={{uri:cyclePark.getPicurl()}} 
              />
            </View>
          }
      </View>
    )
  }


}

export default CycleParkingInformationPage