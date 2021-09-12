import React, { Component } from "react"
import NiceInformativeIcon from "./NiceInformativeIcon"

const image_locker = require('./../../images/locker.png')

/**
 * <StandInfo cyclePark={<CyclePark>} />
 */
class LockerInfo extends Component{

  constructor(props){
    super(props)

    this.state = {
      headingText: 'Locker',
      subHeadingText: null,
      backgroundImage: this.getImage( ) ,
      foregroundImage: null,
      active: this.props.cyclePark.isLocker(),
    }

  }

  getImage( type ){
    return image_locker
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

export default LockerInfo