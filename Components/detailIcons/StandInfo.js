import React, { Component } from "react"
import NiceInformativeIcon from "./NiceInformativeIcon"

const image_other = require(`./../../stands/other.png`)
const image_sheffield = require(`./../../stands/sheffield.png`)
const image_butterfly = require('./../../stands/butterfly.png')
const image_cyclehoop = require('./../../stands/cyclehoop.png')
const image_mstand = require('./../../stands/mstand.png')
const image_post = require('./../../stands/post.png')
const image_pstand = require('./../../stands/pstand.png')
const image_wheelrack = require('./../../stands/wheelrack.png')

/**
 * <StandInfo cyclePark={<CyclePark>} />
 */
class StandInfo extends Component{

  constructor(props){
    super(props)

    this.state = {
      headingText: 'Stand',
      subHeadingText: this.props.cyclePark.getType(),
      backgroundImage: this.getImage( this.props.cyclePark.getType() ) ,
      foregroundImage: null,
      active: true,
    }

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
      />
    )
  }

}

export default StandInfo