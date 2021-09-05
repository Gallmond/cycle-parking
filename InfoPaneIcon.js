import React, { Component } from 'react'
import { View, Text, StyleSheet } from "react-native"

class InfoPaneIcon extends Component{

  constructor(props){
    super(props)
    this.state = {
      text: 'An Icon'     
    }
  }

  render(){
    return (
      <View style={styles.view} >
        <Text style={styles.text}>{this.state.text}</Text>
      </View>
    ) 
  }

}

const styles = StyleSheet.create({
  view:{
    height: '100%',
    backgroundColor: 'red',
    flex:1,
    borderColor: 'black',
    borderWidth: 1,
    padding:5
  },
  text: {
    color: 'white',
    fontSize: 20,
    alignContent: 'center'
  }
})

export default InfoPaneIcon