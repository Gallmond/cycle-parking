import React, { Component } from "react"
import { View, StyleSheet, Text } from "react-native"

class SettingsPage extends Component{
  constructor(props){
    super(props)

    this.styles = StyleSheet.create({
      outer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'green'
      }
    })

  }

  render(){
    return(
      <View style={this.styles.outer}>
        <Text>//TODO settings here</Text>
      </View>
    )
  }
  
}

export default SettingsPage