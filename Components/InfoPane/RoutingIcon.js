import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, ColorPropType } from "react-native"
import themes from '../../Theme'
import InfoPaneIcon from './InfoPaneIcon'

const image_arrow = require(`./../../images/arrow.png`)

class RoutingIcon extends InfoPaneIcon{

  constructor(props){
    super(props)

    // override default styles
    this.styles = StyleSheet.flatten([this.styles, {
      view:{
        ...this.styles.view,
        // backgroundColor: '#669DF6'
        backgroundColor: themes.main.secondary
      },
      text:{
        ...this.styles.text,
        color: themes.main.text.onSecondary
      }
    }])
    console.log('this.styles', this.styles);

  }

  getImage(){
    return <Image style={this.styles.image} source={image_arrow} />
  }

  render(){
    return (
      <View style={this.styles.view}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={this.styles.text}>Directions</Text>
          {this.getImage()}
        </TouchableOpacity>
      </View>
    ); 
  }

}

export default RoutingIcon