import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import themes from '../../../Theme';

/**
 * props:
 *  marker
 *  style
 */
class ListItem extends Component {
  constructor(props) {
    super(props);

    this.marker = props.marker;

    const defaultStyles = {
      outer:{
        backgroundColor: 'green',
        ...themes.debugHighlight,
        height: 60,

        flexDirection: 'row'
      },
      part:{
        flex:1,
        ...themes.debugHighlight
      }
    }

    this.style = StyleSheet.create(defaultStyles)
    
  }

  render() {
    return (
      <TouchableOpacity style={this.style.outer}>
        <Text style={this.style.part}>stnd</Text>
        <Text style={this.style.part}>umbr</Text>
        <Text style={this.style.part}>{this.marker.id} Spaces</Text>
        <Text style={this.style.part}>bmk</Text>
      </TouchableOpacity>
    );
  }
}

export default ListItem;
