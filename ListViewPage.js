import React, {Component} from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Card from "./Components/Card"
import themes from "./Theme"

/**
 * searchedMarkers
 * bookmarkedMarkers
 * optionSelected
 */
class ListViewPage extends Component {
  constructor(props) {
    super(props);

    this.style = StyleSheet.create({
      outer: {
        ...StyleSheet.absoluteFillObject,
        width: '80%',
        backgroundColor: themes.main.background,

        flexDirection: 'column',
      },
      rowElement: {
        height: 50,
        width: '100%',
      },
    });
  }

  optionElementPressed(markerObject) {
    if (this.props.optionSelected) {
      this.props.optionSelected(markerObject);
    }
  }

  optionElement(markerObject) {
    const cyclePark = markerObject.cyclepark;
    const typeName = cyclePark.getType();
    const spaces = cyclePark.getSpaces();
    const name = cyclePark.getName();
    const dist = cyclePark.getDistance(); // metres

    let distText = '';
    if (dist !== null) {
      const km = (dist / 1000).toFixed(1);
      distText = `: ${km} km`;
    }

    const str = `${typeName} (${spaces})${distText}`;

    return (
      <TouchableOpacity
        key={cyclePark.getId()}
        onPress={() => {
          this.optionElementPressed(markerObject);
        }}>
        <Card style={{height:'150px'}}>
          <Text>{str}</Text>
        </Card>
      </TouchableOpacity>
    );
  }

  /**
   * returns this.props.searchedMarkers and this.props.bookmarkedMarkers in order sorted by dist
   * ones with no dist (ie bookmarks) are listed first
   *
   * @returns array
   * @memberof ListViewPage
   */
  getOrderedMarkers() {
    const searchedMarkers =
      !Array.isArray(this.props.searchedMarkers) ||
      this.props.searchedMarkers.length === 0
        ? []
        : this.props.searchedMarkers;

    const bookmarkedMarkers =
      !Array.isArray(this.props.bookmarkedMarkers) ||
      this.props.bookmarkedMarkers.length === 0
        ? []
        : this.props.bookmarkedMarkers;

    const allMarkers = [...searchedMarkers, ...bookmarkedMarkers];
    allMarkers.sort((a, b) => {
      let a_dist = a.cyclepark.getDistance();
      let b_dist = b.cyclepark.getDistance();

      // if distance is null it should go first (probably a bookmark)
      if (a_dist === null) a_dist = -65000;
      if (b_dist === null) b_dist = -65000;

      // a is less
      if (a_dist < b_dist) return -1;

      // b is less
      if (a_dist > b_dist) return 1;

      // equal
      return 0;
    });

    return allMarkers
  }

  render() {
    return (
      <View style={this.style.outer}>
        {this.getOrderedMarkers().map( this.optionElement )}
      </View>
    );
  }
}

export default ListViewPage