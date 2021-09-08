import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import InfoPaneIcon from './InfoPaneIcon'

const image_bookmark = require(`./../../images/bookmark.png`)

class BookmarkIcon extends InfoPaneIcon{

  constructor(props){
    super(props)

    // override default styles
    this.styles = StyleSheet.flatten([this.styles, {
      // backgroundColor: '#FBE9E8'
      view:{
        ...this.styles.view,
        backgroundColor: '#FBE9E8'
      }
    }])
    console.log('this.styles', this.styles);

  }

  getImage(){
    return <Image style={this.styles.image} source={image_bookmark} />
  }

  render(){
    return (
      <View style={this.styles.view}>
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={this.styles.text}>Bookmark</Text>
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

export default BookmarkIcon