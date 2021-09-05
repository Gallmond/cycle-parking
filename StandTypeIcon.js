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

  //TODO this is not rerendering
  getImage(){
    let to_return = <Image style={styles.image} source={image_other}/>
    let sd = this.props.standtype.toLocaleLowerCase()
    console.log('sd', sd);
    if(sd === 'other') to_return = <Image style={styles.image} source={image_other}/>
    if(sd === 'sheffield') to_return = <Image style={styles.image} source={image_sheffield}/>
    if(sd === 'cyclehoop') to_return = <Image style={styles.image} source={image_cyclehoop}/>
    if(sd === 'm stand') to_return = <Image style={styles.image} source={image_mstand}/>
    if(sd === 'butterfly') to_return = <Image style={styles.image} source={image_butterfly}/>
    if(sd === 'wheel rack') to_return = <Image style={styles.image} source={image_wheelrack}/>
    if(sd === 'post') to_return = <Image style={styles.image} source={image_post}/>
    if(sd === 'p stand') to_return = <Image style={styles.image} source={image_pstand}/>
    return to_return
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