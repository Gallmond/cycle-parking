import React, {Component} from "react";
import InformationBarIcon from "./InformationBarIcon";

const image_photo = require('./../../../images/photo.png')

/**
 * props
 *  marker
 *  onPress
 */
class PhotoIcon extends Component{

  constructor(props){
    super(props)

    this.marker = props.marker
    this.onPress = props.onPress

  }

  render(){

    return(
      <InformationBarIcon
        onPress={this.onPress}
        iconImage={image_photo}
        iconText={'Photo'}
      />
    )
  }

}

export default PhotoIcon