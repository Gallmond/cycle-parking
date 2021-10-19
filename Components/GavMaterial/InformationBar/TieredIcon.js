import React, {Component} from "react";
import InformationBarIcon from "./InformationBarIcon";

const image_tiered = require('./../../../images/tiered.png')

/**
 * props
 *  marker
 */
class TieredIcon extends Component{

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
        iconImage={image_tiered}
        iconText={'Tiered'}
      />
    )
  }

}

export default TieredIcon