import React, { Component } from "react"
import { Text, StyleSheet } from "react-native"
import NiceInformativeIcon from "./NiceInformativeIcon"

/**
 * <StandInfo cyclePark={<CyclePark>} />
 */
class SpacesInfo extends Component{

  constructor(props){
    super(props)

    this.state = {
      headingText: 'Spaces',
      subHeadingText: null,
      backgroundImage: null,
      foregroundImage: null,
      active: true,
    }

    this.styles = StyleSheet.create({
      text: {
        fontSize: 45,
      }
    })

  }

  getImage( type ){
    let sd = type.toString().toLowerCase()
    let image_file = image_other
    if(sd === 'other') image_file = image_other
    if(sd === 'sheffield') image_file = image_sheffield
    if(sd === 'cyclehoop') image_file = image_cyclehoop
    if(sd === 'm stand') image_file = image_mstand
    if(sd === 'butterfly') image_file = image_butterfly
    if(sd === 'wheel rack') image_file = image_wheelrack
    if(sd === 'post') image_file = image_post
    if(sd === 'p stand') image_file = image_pstand
    return image_file
  }

  render(){
    return(
      <NiceInformativeIcon
        active={this.state.active}
        headingText={this.state.headingText}
        subHeadingText={this.state.subHeadingText}
        backgroundImage={this.state.backgroundImage}
        foregroundImage={this.state.foregroundImage}
      >
        <Text style={this.styles.text}>{this.props.cyclePark.getSpaces()}</Text>
      </NiceInformativeIcon>
    )
  }

}

export default SpacesInfo