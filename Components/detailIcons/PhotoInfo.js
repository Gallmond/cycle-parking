import React, { Component } from "react"
import NiceInformativeIcon from "./NiceInformativeIcon"

const image_photo = require('./../../images/photo.png')

/**
 * <PhotoInfo cyclePark={<CyclePark>} />
 */
class PhotoInfo extends Component{

  constructor(props){
    super(props)

    this.state = {
      headingText: 'Photo',
      subHeadingText: null,
      backgroundImage: this.getImage( ) ,
      foregroundImage: null,
      active: true,
    }

  }

  getImage( type ){
    return image_photo
  }

  render(){
    return(
      <NiceInformativeIcon
        onPress={this.props.onPress}
        active={this.state.active}
        headingText={this.state.headingText}
        subHeadingText={this.state.subHeadingText}
        backgroundImage={this.state.backgroundImage}
        foregroundImage={this.state.foregroundImage}
      />
    )
  }

}

export default PhotoInfo