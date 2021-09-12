import React, { Component } from "react"
import NiceInformativeIcon from "./NiceInformativeIcon"

const image_locked = require('./../../images/locked.png')

/**
 * <StandInfo cyclePark={<CyclePark>} />
 */
class SecureInfo extends Component{

  constructor(props){
    super(props)

    this.state = {
      headingText: 'Secure',
      subHeadingText: null,
      backgroundImage: this.getImage( ) ,
      foregroundImage: null,
      active: this.props.cyclePark.isSecure(),
    }

  }

  getImage( type ){
    return image_locked
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

export default SecureInfo