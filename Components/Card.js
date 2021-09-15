import React, { Component } from "react"
import { StyleSheet, View } from "react-native"
import themes from "../Theme"

class Card extends Component{

  constructor(props){
    super(props)

    let defaultStyles = {
      backgroundColor: themes.main.surface,
      borderColor: '#C5C5C5',
      borderWidth: 1,
      borderBottomWidth: 3,
      borderRadius: 5,
      margin: 2, // from box to start of content
      padding: 5, // padding from edge of content inwards

    }

    if(this.props.style){
      defaultStyles = {...defaultStyles, ...this.props.style}
    }

    this.style = StyleSheet.create({
      card:defaultStyles
    })

  }

  render(){
    const {style, ...allOtherProps} = this.props; // strip style out
    return <View {...allOtherProps} style={this.style.card}  >{this.props.children}</View>
  }

}

export default Card