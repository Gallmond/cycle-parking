import React, {Component} from "react";
import InformationBarIcon from "./InformationBarIcon";

const image_locked = require('./../../../images/locked.png')
const image_unlocked = require('./../../../images/unlocked.png')

/**
 * props
 *  marker
 */
class SecureIcon extends Component{

  constructor(props){
    super(props)

    this.marker = props.marker

  }

  render(){

    const iconImage = this.marker.cyclepark.isSecure()
      ? image_locked
      : image_unlocked

    const contentOpacity = this.marker.cyclepark.isSecure()
      ? 1
      : 0.3

    return(
      <InformationBarIcon
        contentOpacity={contentOpacity}
        iconImage={iconImage}
        iconText={'Secure'}
      />
    )
  }

}

export default SecureIcon