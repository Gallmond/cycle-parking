import React, {Component} from 'react';
import { StyleSheet, Image, Pressable } from 'react-native';
import themes from '../../../Theme';

import image_search from './../../../images/icons/magnifying-glass.png'

class FAB extends Component{

  constructor(props){
    super(props)

    const passedInStyle = this.props.style
      ? this.props.style
      : {}

    const styles = {
      outer: {
        height: 60,
        aspectRatio: 1,
        borderRadius: 30,

        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",

        backgroundColor: themes.main.secondaryVariant,

        ...passedInStyle,
      },
      iconImage:{
        width:'50%',
        height:'50%',
        resizeMode: 'stretch',
      },
    }
    

    this.style = StyleSheet.create({...styles});

  }

  render(){
    return (
      <Pressable style={this.style.outer} onPress={()=>{
        this.props.onPress 
          ? this.props.onPress() 
          : null
      }}>
        <Image style={this.style.iconImage} source={image_search} />
      </Pressable>
    );
  }


}

export default FAB