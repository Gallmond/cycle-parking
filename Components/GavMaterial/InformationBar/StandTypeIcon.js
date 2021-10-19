import React, {Component} from "react";
import InformationBarIcon from "./InformationBarIcon";

const stands = {
  butterfly: require('./../../../stands/butterfly.png'),
  cyclehoop: require('./../../../stands/cyclehoop.png'),
  mstand: require('./../../../stands/mstand.png'),
  other: require('./../../../stands/other.png'),
  post: require('./../../../stands/post.png'),
  pstand: require('./../../../stands/pstand.png'),
  sheffield: require('./../../../stands/sheffield.png'),
  wheelrack: require('./../../../stands/wheelrack.png'),
};

/**
 * props
 *  marker
 */
class StandTypeIcon extends Component{

  constructor(props){
    super(props)

    this.marker = props.marker

  }

  getStandImage(standType) {
    const k = standType.toLowerCase().replace(' ','');
    return stands[k] ? stands[k] : null;
  }

  render(){

    const iconText = this.props.marker.cyclepark.getType()
    const iconImage = this.getStandImage( iconText )

    return(
      <InformationBarIcon
        iconText={iconText}
        iconImage={iconImage}
      />
    )
  }

}

export default StandTypeIcon