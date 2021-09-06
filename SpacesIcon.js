import React from 'react'
import { View, Text, StyleSheet, Image } from "react-native"
import InfoPaneIcon from './InfoPaneIcon'

class SpacesIcon extends InfoPaneIcon{

  constructor(props){
    super(props)
  }

  render(){
    return (
      <View style={styles.view} >
        <Text style={styles.text}>Spaces</Text>
        <Text style={styles.spaces}>{this.props.spaces}</Text>
      </View>
    ) 
  }

}

const styles = StyleSheet.create({
  spaces: {
    flex: 0.8,
    aspectRatio: 1,
    color: 'white',
    fontSize: 40,
    textAlign: 'center'
  },
  view:{
    height: '100%',
    backgroundColor: '#185ABC',
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

export default SpacesIcon