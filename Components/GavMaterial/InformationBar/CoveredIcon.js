import React, {Component} from "react";
import InformationBarIcon from "./InformationBarIcon";

const image_umbrella = require('./../../../images/umbrella.png')

/**
 * props
 *  marker
 */
class CoveredIcon extends Component{

  constructor(props){
    super(props)

    this.marker = props.marker

  }

  render(){

    const contentOpacity = this.marker.cyclepark.isCovered()
      ? 1
      : 0.3

    return(
      <InformationBarIcon
        contentOpacity={contentOpacity}
        iconImage={image_umbrella}
        iconText={'Covered'}
      />
    )
  }

}

export default CoveredIcon