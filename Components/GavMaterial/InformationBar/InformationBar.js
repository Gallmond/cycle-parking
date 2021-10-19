import React, {Component} from "react";
import { View, Text } from "react-native";
import themes from "../../../Theme";
import CoveredIcon from "./CoveredIcon";
import HangerIcon from "./HangerIcon";
import InformationBarIcon from "./InformationBarIcon";
import LockerIcon from "./LockerIcon";
import SecureIcon from "./SecureIcon";
import SpacesIcon from "./SpacesIcon";
import StandTypeIcon from "./StandTypeIcon";
import TieredIcon from "./TieredIcon";
import PhotoIcon from "./PhotoIcon";

const image_umbrella = require('./../../../images/umbrella.png');

/**
 * props:
 *  selectedMarker
 */
class InformationBar extends Component{
  constructor(props){
    super(props)

    this.selectedMarker = this.props.selectedMarker

  }

  photoIconPressed(){
    console.log('InformationBar.photoIconPressed()')
    //TODO handle image showing. pass out the images to a handler set in app.js
  }

  render(){
    return(
      <View style={{
        backgroundColor: themes.main.background,
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '20%',

        flexDirection: 'column'
      }}
      key={this.props.selectedMarker.cyclepark.getId()} // forces rerender on prop change
      >

        {/* top row */}
        <View style={{
          flex: 1,
          backgroundColor: themes.main.primary,
          flexDirection: 'row',
        }}>
          <StandTypeIcon marker={this.props.selectedMarker} />
          <SpacesIcon marker={this.props.selectedMarker}  />
          <SecureIcon marker={this.props.selectedMarker}  />
          <CoveredIcon marker={this.props.selectedMarker} />
        </View>

        {/* bottom row */}
        <View style={{
          flex: 1,
          backgroundColor: themes.main.secondary,
          flexDirection: 'row',
        }}>
          <TieredIcon marker={this.props.selectedMarker} />
          <HangerIcon marker={this.props.selectedMarker} />
          <LockerIcon marker={this.props.selectedMarker} />
          <PhotoIcon marker={this.props.selectedMarker} onPress={this.photoIconPressed} />
        </View>

      </View>
    )
  }

}

export default InformationBar