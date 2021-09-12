import React from 'react'
import { View, Text, StyleSheet, Image } from "react-native"
import InfoPaneIcon from './InfoPaneIcon'
import themes from '../../Theme'

const image_locked = require(`./../../images/locked.png`)
const image_unlocked = require(`./../../images/unlocked.png`)

class SecureIcon extends InfoPaneIcon{

  constructor(props){
    super(props)

    this.styles = StyleSheet.flatten([this.styles,{
      view: {
        ...this.styles.view,
        // backgroundColor: '#FDE293',
        backgroundColor: themes.main.secondary
      },
      text:{
        ...this.styles.text,
        // 
        color: themes.main.text.onSecondary
      }
    }])

  }

  getImage(){
    const is_secure = this.props.secure
    let source_file = image_unlocked
    if(is_secure) source_file = image_locked
    return <Image style={this.styles.image} source={source_file} />
  }

  render(){
    return (
      <View style={this.styles.view} >
        <Text style={this.styles.text}>Secure</Text>
        {this.getImage()}
      </View>
    ) 
  }

}

export default SecureIcon