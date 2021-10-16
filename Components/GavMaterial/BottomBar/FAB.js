import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import themes from '../../../Theme';

class FAB extends Component{

  constructor(props){
    super(props)

    this.style = StyleSheet.create({
      outer: {
        position: 'absolute',
        right: 30,
        bottom: '100%',
        height: 60,
        aspectRatio: 1,
        borderRadius: 30,

        transform: [{translateY: 30}],


        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",

        backgroundColor: themes.main.secondaryVariant,
      }
    });

  }

  render(){
    return(
      <View style={this.style.outer}>
        <Text>TEST</Text>
      </View>
    )
  }


}

export default FAB