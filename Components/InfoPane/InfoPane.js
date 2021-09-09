import React, { Component } from 'react'
import { View, StyleSheet } from "react-native"
import SecureIcon from './SecureIcon'
import SpacesIcon from './SpacesIcon'
import StandTypeIcon from './StandTypeIcon'
import { Linking } from 'react-native'
import RoutingIcon from './RoutingIcon'
import MoreInfoIcon from './MoreInfoIcon'

class InfoPane extends Component{

  constructor(props){
    super(props)

    console.log('this.props', this.props);

    this.state = {
      is_hidden: true,
      height: '10%',
      text: 'no text'
    }
  }

  toggle(){
    const is_hidden = !this.state.is_hidden
    this.setState({...this.state, is_hidden: is_hidden}, this.updateVisible)
    return this
  }
  show(){
    console.log('show', this.state)
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

  getStyle(){
    return {
      width: styles.view.width,
      height: this.state.height,
      backgroundColor: styles.view.backgroundColor,
      flexDirection: "row"
    }
  }

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
    return (
      <View style={ this.getStyle() } >
        <StandTypeIcon standtype={this.props.marker.cyclepark.getType()} />
        <SpacesIcon spaces={this.props.marker.cyclepark.getSpaces()} />
        <SecureIcon secure={this.props.marker.cyclepark.isSecure()} />
        <RoutingIcon onPress={()=>{console.log('BOOKMARK ME');this.openGoogleMapsWithDirections()}} />
        <MoreInfoIcon onPress={this.props.onShowInfoPane} />
      </View>
    ) 
  }

}

const styles = StyleSheet.create({
  view:{
    flex: 1,
    width: '100%',
    backgroundColor: 'blue'
  },
  text: {
    color: 'white',
    fontSize: 20
  }
})

export default InfoPane