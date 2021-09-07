import React from 'react'
import { View, Text, StyleSheet, Image } from "react-native"
import InfoPaneIcon from './InfoPaneIcon'

class SpacesIcon extends InfoPaneIcon{

  constructor(props){
    super(props)

    this.styles = StyleSheet.flatten([this.styles,{
      view: {
        ...this.styles.view,
        backgroundColor: '#185ABC',
      },
      text: {
        ...this.styles.text,
        color: 'white',
      },
      spaces: {
        flex: 0.8,
        aspectRatio: 1,
        color: 'black',
        fontSize: 40,
        textAlign: 'center'
      }

    }])

  }

  render(){
    return (
      <View style={this.styles.view} >
        <Text style={this.styles.text}>Spaces</Text>
        <Text style={this.styles.spaces}>{this.props.spaces}</Text>
      </View>
    ) 
  }

}

export default SpacesIcon