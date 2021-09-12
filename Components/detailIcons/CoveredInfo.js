import React, { Component } from "react"
import NiceInformativeIcon from "./NiceInformativeIcon"

const image_umbrella = require('./../../images/umbrella.png')

/**
 * <StandInfo cyclePark={<CyclePark>} />
 */
class CoveredInfo extends Component{

  constructor(props){
    super(props)

    this.state = {
      headingText: 'Covered',
      subHeadingText: null,
      backgroundImage: this.getImage( ) ,
      foregroundImage: null,
      active: this.props.cyclePark.isCovered(),
    }

  }

  getImage( type ){
    return image_umbrella
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

export default CoveredInfo