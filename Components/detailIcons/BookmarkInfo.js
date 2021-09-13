import React, { Component } from "react"
import NiceInformativeIcon from "./NiceInformativeIcon"

const image_bookmark = require('./../../images/bookmark.png')

/**
 * <BookmarkInfo cyclePark={<CyclePark>} />
 */
class BookmarkInfo extends Component{

  constructor(props){
    super(props)

    this.state = {
      headingText: 'Bookmark',
      subHeadingText: this.props.subHeadingText,
      backgroundImage: this.getImage( ) ,
      foregroundImage: null,
      active: true,
    }

  }

  getImage( type ){
    return image_bookmark
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

export default BookmarkInfo