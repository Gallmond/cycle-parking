import React, { Component } from "react"
import NiceInformativeIcon from "./NiceInformativeIcon"

const image_tiered = require('./../../images/tiered.png')

/**
 * <StandInfo cyclePark={<CyclePark>} />
 */
class TieredInfo extends Component{

  constructor(props){
    super(props)

    this.state = {
      headingText: 'Tiered',
      subHeadingText: null,
      backgroundImage: this.getImage( ) ,
      foregroundImage: null,
      active: this.props.cyclePark.isTiered(),
    }

  }

  getImage( type ){
    return image_tiered
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

export default TieredInfo