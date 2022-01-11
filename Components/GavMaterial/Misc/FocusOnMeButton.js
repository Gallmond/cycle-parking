import React, {Component} from 'react';
import {Pressable, Image} from 'react-native';

const targetImage = require('../../../images/icons/target.png');

class FocusOnMeButton extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.props.onPress;
  }

  render() {
    return (
      <Pressable
        onPress={this.onPress}
        style={{
          height: '10%',
          aspectRatio: 1,
          position: 'absolute',
          top: '50%',
          left: 0,
          padding: 5,
          // ...themes.debugHighlight
        }}>
        <Image
          style={{
            width: undefined,
            height: undefined,
            flex: 1,
            opacity: 0.5,
          }}
          source={targetImage}
        />
      </Pressable>
    );
  }
}

export default FocusOnMeButton;
