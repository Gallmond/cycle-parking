import React from 'react'
import { View, Text, StyleSheet, Image } from "react-native"
import InfoPaneIcon from './InfoPaneIcon'

const image_bookmark = require(`./images/bookmark.png`)

class BookmarkIcon extends InfoPaneIcon{

  constructor(props){
    super(props)
  }

  getImage(){
    return <Image style={styles.image} source={image_bookmark} />
  }

  render(){
    return (
      <View style={styles.view} >
        <Text style={styles.text}>Bookmark</Text>
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
    backgroundColor: '#FBE9E8',
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

export default BookmarkIcon