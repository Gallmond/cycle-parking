import React, { Component } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import themes from "../../../Theme";
import MenuButton from "./MenuButton";
import SettingsButton from "./SettingsButton";
import FAB from "./FAB";

class BottomBar extends Component{

  constructor(props){
    super(props)

    this.style = StyleSheet.create({
      outer: {
        // ...StyleSheet.absoluteFillObject,
        bottom: 0,
        height: '10%',
        width: '100%',

        backgroundColor: themes.main.secondary,
        flexDirection: 'row', 
        justifyContent: 'flex-start' 
      },
    })

  }

  render(){
    return (
      <View style={this.style.outer}>
        <MenuButton />
        <SettingsButton />
        <FAB
          style={{
            position: 'absolute',
            right: 30,
            bottom: '100%',
            transform: [{translateY: 30}],
          }}
          onPress={() => {
            console.log('BOTTOMBAR FAB');
          }}
        />
      </View>
    );
  }

}

export default BottomBar;


