import React, { Component } from "react";
import { View, Text, ImageBackground, Image, StyleSheet } from "react-native";
import themes from "../../Theme";

const image_prohibited = require('./../../images/prohibited.png')
const image_questionmark = require('./../../images/questionmark.png')

/**
 * set with props:
 *  headingText
 *  subHeadingText
 *  backgroundImage
 *  foregroundImage
 */
class NiceInformativeIcon extends Component{

  constructor(props){
    super(props)

    console.log('this.props.children', this.props.children);

    this.active = props.active === undefined ? true : props.active
    this.headingText = props.headingText ?? 'Header text'
    this.subHeadingText = props.subHeadingText ?? null
    this.backgroundImage = props.backgroundImage ?? image_questionmark
    this.foregroundImage = props.foregroundImage ?? null

    this.styles = StyleSheet.create({
      main:{
        borderWidth: 1,
        borderBottomWidth: 3,
        borderRadius: 5,
        borderColor: '#C5C5C5',

        backgroundColor: themes.main.surface,
        aspectRatio: 1,
      },  
      textContainer:{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'brown'
      },
      heading:{
        padding: 0,
        margin: 0,
        textAlign: 'center',
        fontSize: 20,
        flex: 2
      },
      subHeading:{
        textAlign: 'center',
        fontSize: 10,
        flex: 1
      },
      imageContainer:{
        // borderWidth: 1,
        // borderColor: 'white',
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
      },
      image:{
        resizeMode: 'stretch',
        height: '100%',
        aspectRatio: 1
      }
    })

  }

  getHeader(){
    return <Text style={this.styles.heading} >{this.headingText}</Text>
  }
  getSubheader(){
    return <Text style={this.styles.subHeading} >{this.subHeadingText}</Text>
  }
  getImageSection(){
    return(
      <ImageBackground imageStyle={this.styles.image} style={this.styles.image} source={this.backgroundImage ? this.backgroundImage : null} >
        <Image style={this.styles.image} source={this.foregroundImage ? this.foregroundImage : null} />
      </ImageBackground>
    )
  }

  render(){

    return(
      <View style={[this.styles.main, this.props.style]} opacity={this.active ? 1 : 0.3} >
        {/* <View style={this.styles.textContainer} > */}
          {this.headingText && this.getHeader()}
          {this.subHeadingText && this.getSubheader()}
        {/* </View> */}
        <View style={this.styles.imageContainer} >
          {this.props.children ? this.props.children : this.getImageSection()}
        </View>
      </View>
    )
  }

}

export default NiceInformativeIcon