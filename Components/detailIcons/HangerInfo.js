import React, { Component } from "react"
import NiceInformativeIcon from "./NiceInformativeIcon"

const image_hanger = require('./../../images/hanger.png')

/**
 * <HangerInfo cyclePark={<CyclePark>} />
 */
class HangerInfo extends Component{

  constructor(props){
    super(props)

    this.state = {
      headingText: 'Hanger',
      subHeadingText: null,
      backgroundImage: this.getImage( ) ,
      foregroundImage: null,
      active: this.props.cyclePark.isHanger(),
    }

  }

  getImage( type ){
    return image_hanger
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

export default HangerInfo