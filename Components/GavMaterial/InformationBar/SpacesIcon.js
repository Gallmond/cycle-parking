import React, {Component} from "react";
import InformationBarIcon from "./InformationBarIcon";

/**
 * props
 *  marker
 */
class SpacesIcon extends Component{

  constructor(props){
    super(props)

    this.marker = props.marker

  }

  render(){

    const spaces = this.marker.cyclepark.getSpaces()

    return(
      <InformationBarIcon
        iconImageText={spaces}
        iconText={'Spaces'}
      />
    )
  }

}

export default SpacesIcon