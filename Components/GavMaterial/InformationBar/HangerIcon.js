import React, {Component} from "react";
import InformationBarIcon from "./InformationBarIcon";

const image_hanger = require('./../../../images/hanger.png')

/**
 * props
 *  marker
 */
class HangerIcon extends Component{

  constructor(props){
    super(props)

    this.marker = props.marker

  }

  render(){

    const contentOpacity = this.marker.cyclepark.isHanger()
      ? 1
      : 0.3

    return(
      <InformationBarIcon
        contentOpacity={contentOpacity}
        iconImage={image_hanger}
        iconText={'Hanger'}
      />
    )
  }

}

export default HangerIcon