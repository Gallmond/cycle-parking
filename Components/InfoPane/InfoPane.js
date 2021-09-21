import React, { Component } from 'react'
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native"
import SecureIcon from './SecureIcon'
import SpacesIcon from './SpacesIcon'
import StandTypeIcon from './StandTypeIcon'
import { Linking } from 'react-native'
import RoutingIcon from './RoutingIcon'
import MoreInfoIcon from './MoreInfoIcon'
import Card from '../Card'
import themes from '../../Theme'

const image_other = require(`./../../stands/other.png`);
const image_sheffield = require(`./../../stands/sheffield.png`);
const image_butterfly = require(`./../../stands/butterfly.png`);
const image_cyclehoop = require(`./../../stands/cyclehoop.png`);
const image_mstand = require(`./../../stands/mstand.png`);
const image_post = require(`./../../stands/post.png`);
const image_pstand = require(`./../../stands/pstand.png`);
const image_wheelrack = require(`./../../stands/wheelrack.png`);

const image_umbrella = require(`./../../images/umbrella.png`);
const image_locked = require(`./../../images/locked.png`);
const image_unlocked = require(`./../../images/unlocked.png`);
const image_locker = require(`./../../images/locker.png`);
const image_tiered = require(`./../../images/tiered.png`);
const image_hanger = require(`./../../images/hanger.png`);
const image_photo = require(`./../../images/photo.png`);
const image_bookmark = require(`./../../images/bookmark.png`);
const image_arrow = require(`./../../images/arrow.png`);

class InfoPane extends Component{

  constructor(props){
    super(props)

    this.state = {
      is_hidden: true,
    }

    this.style = StyleSheet.create({
      outer:{
        // flex: 2,
        width: '100%',
        backgroundColor: 'blue',

        flexDirection: 'row',
        flexWrap: 'wrap'
      },
      item:{
        width: '20%',
        aspectRatio: 1,

        margin: 0,



      },


      text: {
        color: 'white',
        fontSize: 20
      }
    })

  }

  toggle(){
    const is_hidden = !this.state.is_hidden
    this.setState({...this.state, is_hidden: is_hidden}, this.updateVisible)
    return this
  }
  show(){
    const is_hidden = false
    this.setState({...this.state, is_hidden: is_hidden}, this.updateVisible)
    return this
  }
  hide(){
    const is_hidden = true
    this.setState({...this.state, is_hidden: is_hidden}, this.updateVisible)
    return this
  }

  updateVisible(){
    console.log('updateVisible', this.state)
    this.setState({...this.state, height: this.state.is_hidden ? '0%' : '10%'})
    return this
  }

  setTextAndShow( new_text ){
    this.setState({text: new_text}, this.show)
    return this
  }

  isHidden(){
    return this.state.is_hidden
  }

  getStandImage( type ){
    let sd = type.toString().toLowerCase()
    let image_file = image_other
    if(sd === 'other') image_file = image_other
    if(sd === 'sheffield') image_file = image_sheffield
    if(sd === 'cyclehoop') image_file = image_cyclehoop
    if(sd === 'm stand') image_file = image_mstand
    if(sd === 'butterfly') image_file = image_butterfly
    if(sd === 'wheel rack') image_file = image_wheelrack
    if(sd === 'post') image_file = image_post
    if(sd === 'p stand') image_file = image_pstand
    return image_file
  }

  // getStyle(){
  //   return {
  //     width: styles.view.width,
  //     height: this.state.height,
  //     backgroundColor: styles.view.backgroundColor,
  //     flexDirection: "row"
  //   }
  // }

  openGoogleMapsWithDirections(){
    const query = [
      'api=1',
      'destination=' + encodeURIComponent(`${this.props.marker.cyclepark.getLat()},${this.props.marker.cyclepark.getLon()}`),
      'travelmode=bicycling'
    ]
    const gmap_url = 'https://www.google.com/maps/dir/' + '?' + query.join('&')
    Linking.openURL(gmap_url)
  }

  render(){

    const cyclePark = this.props.marker.cyclepark
    const standImage = this.getStandImage( cyclePark.getType() )
    const spaces = cyclePark.getSpaces()

    const isCovered = cyclePark.isCovered()
    const isSecure = cyclePark.isSecure()
    const isLocker = cyclePark.isLocker()
    const isTiered = cyclePark.isTiered()
    const isHanger = cyclePark.isHanger()


    return (
      <View style={this.style.outer}>

        <Card style={this.style.item}>
          <Image style={{height: undefined, width: undefined, flex: 1}} source={standImage} />
        </Card>

        <Card style={this.style.item}>
          <Text style={{
            textAlign: 'center',
            textAlignVertical: 'center',
            height: '100%',
            fontSize: 40,
            color: themes.main.text.onSurface
          }}>{spaces}</Text>
        </Card>

        <Card style={this.style.item}>
          <Image opacity={isCovered ? 1 : 0.3} style={{height: undefined, width: undefined, flex: 1}} source={image_umbrella} />
        </Card>

        <Card style={this.style.item}>
          <Image opacity={isSecure ? 1 : 0.3} style={{height: undefined, width: undefined, flex: 1}} source={isSecure ? image_locked : image_unlocked} />
        </Card>

        <Card style={this.style.item}>
          <Image opacity={isLocker ? 1 : 0.3} style={{height: undefined, width: undefined, flex: 1}} source={image_locker} />
        </Card>

        <Card style={this.style.item}>
          <Image opacity={isTiered ? 1 : 0.3} style={{height: undefined, width: undefined, flex: 1}} source={image_tiered} />
        </Card>

        <Card style={this.style.item}>
          <Image opacity={isHanger ? 1 : 0.3} style={{height: undefined, width: undefined, flex: 1}} source={image_hanger} />
        </Card>

        {/* //TODO add photo button functionality */}
        <Card style={this.style.item}>
          <Image style={{height: undefined, width: undefined, flex: 1}} source={image_photo} />
        </Card>

        {/* //TODO add bookmark button functionality */}
        <Card style={this.style.item}>
          <Image style={{height: undefined, width: undefined, flex: 1}} source={image_bookmark} />
        </Card>

        <TouchableOpacity style={this.style.item} onPress={()=>{
            this.openGoogleMapsWithDirections();
          }}>
          <Card style={{margin:0, height:'100%'}}>
            <Image style={{height: undefined, width: undefined, flex: 1}} source={image_arrow} />
          </Card>
        </TouchableOpacity>

      </View>
    );

    // return (
    //   <View style={ this.getStyle() } >
    //     <StandTypeIcon standtype={this.props.marker.cyclepark.getType()} />
    //     <SpacesIcon spaces={this.props.marker.cyclepark.getSpaces()} />
    //     <SecureIcon secure={this.props.marker.cyclepark.isSecure()} />
    //     <RoutingIcon onPress={()=>{this.openGoogleMapsWithDirections()}} />
    //     <MoreInfoIcon onPress={this.props.onShowInfoPane} />
    //   </View>
    // ) 
  }

}



export default InfoPane