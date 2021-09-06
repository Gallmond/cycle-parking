import React from 'react'
import { View, Text, StyleSheet, Image } from "react-native"
import InfoPaneIcon from './InfoPaneIcon'

const image_other = require(`./stands/other.png`)
const image_sheffield = require(`./stands/sheffield.png`)
const image_butterfly = require('./stands/butterfly.png')
const image_cyclehoop = require('./stands/cyclehoop.png')
const image_mstand = require('./stands/mstand.png')
const image_post = require('./stands/post.png')
const image_pstand = require('./stands/pstand.png')
const image_wheelrack = require('./stands/wheelrack.png')

class StandTypeIcon extends InfoPaneIcon{

  constructor(props){
    super(props)
  }

  getImage(){
    let sd = this.props.standtype.toLocaleLowerCase()
    let image_file = image_other
    if(sd === 'other') image_file = image_other
    if(sd === 'sheffield') image_file = image_sheffield
    if(sd === 'cyclehoop') image_file = image_cyclehoop
    if(sd === 'm stand') image_file = image_mstand
    if(sd === 'butterfly') image_file = image_butterfly
    if(sd === 'wheel rack') image_file = image_wheelrack
    if(sd === 'post') image_file = image_post
    if(sd === 'p stand') image_file = image_pstand
    return <Image style={styles.image} source={image_file}/>
  }

  render(){
    return (
      <View style={styles.view} >
        <Text style={styles.text}>{this.props.standtype}</Text>
        {this.getImage()}
      </View>
    ) 
  }

}

const styles = StyleSheet.create({
  image: {
    flex: 0.8,
    aspectRatio: 1,
  },
  view:{
    height: '100%',
    backgroundColor: '#1ea362',
    flex:1,
    borderColor: 'black',
    borderWidth: 1,
    padding:0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 0.2,
    color: 'white',
    fontSize: 10,
  }
})

export default StandTypeIcon