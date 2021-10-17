import React, { Component } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, YellowBox } from "react-native";
import themes from "../../../Theme";
import MenuButton from "./MenuButton";
import SettingsButton from "./SettingsButton";
import FAB from "./FAB";

class BottomBar extends Component {
  constructor(props) {
    super(props);

    this.style = StyleSheet.create({
      outer: {
        // ...StyleSheet.absoluteFillObject,
        bottom: 0,
        height: '10%',
        width: '100%',

        backgroundColor: themes.main.secondary,
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
    });
  }

  render() {
    return (
      <View style={this.style.outer}>
        <MenuButton onPress={()=>{
          this.props.onListViewButtonPress 
            ? this.props.onListViewButtonPress() 
            : null
        }} />
        <SettingsButton onPress={()=>{
          this.props.onSettingsButtonPress 
            ? this.props.onSettingsButtonPress() 
            : null
        }} />
        <FAB
          onPress={()=>{
            this.props.onSearchButtonPress 
              ? this.props.onSearchButtonPress() 
              : null
          }} 
          style={{
            // unfortunately pressable / touchableOpacity
            // cannot be clicked when it falls outside
            // its parents bounds (anywhere up the tree)
            position: 'absolute',
            right: 0,
            height: '100%',
            borderRadius: 0,
          }}
        />
      </View>
    );
  }
}

export default BottomBar;


