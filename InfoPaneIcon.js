import React, { Component } from 'react'
import { View, Text, StyleSheet } from "react-native"

class InfoPaneIcon extends Component{

  constructor(props){
    super(props)
    this.state = {
      text: 'An Icon'     
    }

    // set default styles here
    this.styles = StyleSheet.create({
      view:{
        height: '100%',
        backgroundColor: 'red',
        flex:1,
        borderColor: 'black',
        borderWidth: 1,
        padding:5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      image: {
        flex: 0.8,
        aspectRatio: 1,
      },
      text: {
        flex: 0.2,
        color: 'black',
        fontSize: 10,
      }
    })

  }

  render(){
    return (
      <View style={this.styles.view} >
          <Text style={this.styles.text}>{this.state.text}</Text>
      </View>
    ) 
  }

}

export default InfoPaneIcon