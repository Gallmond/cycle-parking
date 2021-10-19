import React, {Component} from "react";
import InformationBarIcon from "./InformationBarIcon";

const image_locker = require('./../../../images/locker.png')

/**
 * props
 *  marker
 */
class LockerIcon extends Component{

  constructor(props){
    super(props)

    this.marker = props.marker

  }

  render(){

    const contentOpacity = this.marker.cyclepark.isTiered()
      ? 1
      : 0.3

    return(
      <InformationBarIcon
        contentOpacity={contentOpacity}
        iconImage={image_locker}
        iconText={'Locker'}
      />
    )
  }

}

export default LockerIcon