import React from 'react'
import { View, Text, StyleSheet, Image } from "react-native"
import InfoPaneIcon from './InfoPaneIcon'

const image_locked = require(`./images/locked.png`)
const image_unlocked = require(`./images/unlocked.png`)

class SecureIcon extends InfoPaneIcon{

  constructor(props){
    super(props)
  }

  getImage(){
    const is_secure = this.props.secure.toString().toLowerCase() === 'true'
    let source_file = image_unlocked
    if(is_secure) source_file = image_locked
    return <Image style={styles.image} source={source_file} />
  }

  render(){
    return (
      <View style={styles.view} >
        <Text style={styles.text}>Secure</Text>
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
    backgroundColor: '#FDE293',
    flex:1,
    borderColor: 'black',
    borderWidth: 1,
    padding:0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 0.2,
    color: 'black',
    fontSize: 10,
  }
})

export default SecureIcon