import React, {Component} from 'react';
import {Alert, View} from 'react-native';
import themes from '../../../Theme';
import CoveredIcon from './CoveredIcon';
import HangerIcon from './HangerIcon';
import LockerIcon from './LockerIcon';
import SecureIcon from './SecureIcon';
import SpacesIcon from './SpacesIcon';
import StandTypeIcon from './StandTypeIcon';
import TieredIcon from './TieredIcon';
import PhotoIcon from './PhotoIcon';
import userSettings from '../../../UserSettings';

const image_umbrella = require('./../../../images/umbrella.png');

/**
 * props:
 *  selectedMarker
 *  onShowPhotos
 */
class InformationBar extends Component {
  constructor(props) {
    super(props);
    this.selectedMarker = this.props.selectedMarker;
    this.onShowPhotos = this.props.onShowPhotos;
  }

  photoIconPressed = () => {
    if (typeof this.onShowPhotos === 'function') {

      // get user settings
      userSettings.get('alwaysShowImages').then(alwaysShowImages => {

        if (!alwaysShowImages) {
          Alert.alert(
            'Show Image?',
            `Images are download over the internet and could use a lot of data `
            + `(~1.4mb each).\r\n\r\n`
            + `This can be changed in the settings page.`,
            [
              {
                text: 'Show this time',
                onPress: () => {
                  this.onShowPhotos([
                    this.props.selectedMarker.cyclepark.getPicurl1(),
                    this.props.selectedMarker.cyclepark.getPicurl2(),
                  ]);
                },
              },
              {
                text: 'Always show',
                onPress: () => {
                  userSettings.set('alwaysShowImages', true).then(() => {
                    this.onShowPhotos([
                      this.props.selectedMarker.cyclepark.getPicurl1(),
                      this.props.selectedMarker.cyclepark.getPicurl2(),
                    ]);
                  });
                },
              },
              {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
              },
            ],
          );
        } else {
          this.onShowPhotos([
            this.props.selectedMarker.cyclepark.getPicurl1(),
            this.props.selectedMarker.cyclepark.getPicurl2(),
          ]);
        }
      });
    }
  };

  render() {
    return (
      <View
        style={{
          backgroundColor: themes.main.background,
          position: 'absolute',
          top: 0,
          width: '100%',
          height: '20%',

          flexDirection: 'column',
        }}
        key={this.props.selectedMarker.cyclepark.getId()} // forces rerender on prop change
      >
        {/* top row */}
        <View
          style={{
            flex: 1,
            backgroundColor: themes.main.primary,
            flexDirection: 'row',
          }}>
          <StandTypeIcon marker={this.props.selectedMarker} />
          <SpacesIcon marker={this.props.selectedMarker} />
          <SecureIcon marker={this.props.selectedMarker} />
          <CoveredIcon marker={this.props.selectedMarker} />
        </View>

        {/* bottom row */}
        <View
          style={{
            flex: 1,
            backgroundColor: themes.main.secondary,
            flexDirection: 'row',
          }}>
          <TieredIcon marker={this.props.selectedMarker} />
          <HangerIcon marker={this.props.selectedMarker} />
          <LockerIcon marker={this.props.selectedMarker} />
          <PhotoIcon
            marker={this.props.selectedMarker}
            onPress={this.photoIconPressed}
          />
        </View>
      </View>
    );
  }
}

export default InformationBar;
