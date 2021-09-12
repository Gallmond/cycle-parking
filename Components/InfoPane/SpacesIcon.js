import React from 'react'
import { View, Text, StyleSheet, Image } from "react-native"
import themes from '../../Theme'
import InfoPaneIcon from './InfoPaneIcon'

class SpacesIcon extends InfoPaneIcon{

  constructor(props){
    super(props)

    this.styles = StyleSheet.flatten([this.styles,{
      view: {
        ...this.styles.view,
        // backgroundColor: '#185ABC',
        backgroundColor: themes.main.primary
      },
      text: {
        ...this.styles.text,
        // color: 'white',
        color: themes.main.text.onPrimary
      },
      spacesContainer: {
        flex:0.8, justifyContent: 'center'
      },
      spaces: {
        color: 'black',
        fontSize: 25,
        textAlign: 'center',
      }

    }])

  }

  render(){
    return (
      <View style={this.styles.view} >
        <Text style={this.styles.text}>Spaces</Text>
        <View style={this.styles.spacesContainer}>
          <Text style={this.styles.spaces}>{this.props.spaces}</Text>
        </View>
      </View>
    ) 
  }

}

export default SpacesIcon