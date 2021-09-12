import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import InfoPaneIcon from './InfoPaneIcon'
import themes from '../../Theme'

const image_info = require(`./../../images/info.png`)

class MoreInfoIcon extends InfoPaneIcon{

  constructor(props){
    super(props)

    // override default styles
    this.styles = StyleSheet.flatten([this.styles, {
      // backgroundColor: '#FBE9E8'
      view:{
        ...this.styles.view,
        // backgroundColor: '#FBE9E8'
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
    return <Image style={this.styles.image} source={image_info} />
  }

  render(){
    return (
      <View style={this.styles.view}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={this.styles.text}>Information</Text>
          {this.getImage()}
        </TouchableOpacity>
      </View>
    ); 
  }

}

// const styles = StyleSheet.create({
//   image: {
//     flex: 0.8,
//     aspectRatio: 1,
//   },
//   view:{
//     height: '100%',
//     backgroundColor: '#FBE9E8',
//     flex:1,
//     borderColor: 'black',
//     borderWidth: 1,
//     padding:0,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   text: {
//     flex: 0.2,
//     color: 'black',
//     fontSize: 10,
//   }
// })

export default MoreInfoIcon