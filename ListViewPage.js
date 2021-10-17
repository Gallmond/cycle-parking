import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, SafeAreaView, FlatList} from 'react-native';
import Card from './Components/Card';
import themes from './Theme';

const image_other = require(`./stands/other.png`);
const image_sheffield = require(`./stands/sheffield.png`);
const image_butterfly = require(`./stands/butterfly.png`);
const image_cyclehoop = require(`./stands/cyclehoop.png`);
const image_mstand = require(`./stands/mstand.png`);
const image_post = require(`./stands/post.png`);
const image_pstand = require(`./stands/pstand.png`);
const image_wheelrack = require(`./stands/wheelrack.png`);

const image_umbrella = require(`./images/umbrella.png`);
const image_bookmark = require(`./images/bookmark.png`);

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
        width: '65%',
        backgroundColor: themes.main.background,

        flexDirection: 'column',
      },
      rowElement: {
        height: 60,
        width: '100%',

        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      rowContainer: {
        width: '100%',

        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      rowLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
      },
      rowRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      rowPart: {
        // height: '100%',
        // aspectRatio: 1,
        // backgroundColor: 'lightgreen',
      },
      rowPartImage: {
        resizeMode: 'stretch',
        height: '100%',
        aspectRatio: 1,
      },
    });

    this.state = {
      onlyShowBookmarks: false,
    };
  }

  getImage(type) {
    let sd = type.toString().toLowerCase();
    let image_file = image_other;
    if (sd === 'other') image_file = image_other;
    if (sd === 'sheffield') image_file = image_sheffield;
    if (sd === 'cyclehoop') image_file = image_cyclehoop;
    if (sd === 'm stand') image_file = image_mstand;
    if (sd === 'butterfly') image_file = image_butterfly;
    if (sd === 'wheel rack') image_file = image_wheelrack;
    if (sd === 'post') image_file = image_post;
    if (sd === 'p stand') image_file = image_pstand;
    return image_file;
  }

  optionElementPressed(markerObject) {
    if (this.props.optionSelected) {
      this.props.optionSelected(markerObject);
    }
  }

  flatListRenderItem(item) {
    return this.optionElement(item.item);
  }

  optionElement(markerObject) {
    const cyclePark = markerObject.cyclepark;

    const typeName = cyclePark.getType();
    const spaces = cyclePark.getSpaces();
    const name = cyclePark.getName();
    const dist = cyclePark.getDistance(); // metre
    const isBookmark = this.isBookmarked(cyclePark.getId());

    let distStr = '';
    if (dist) {
      dist > 500
        ? (distStr = `${(dist / 1000).toFixed(1)}km`) // 1.2km
        : (distStr = `${dist.toFixed(0)}m`); // 125m
    }

    return (
      <TouchableOpacity
        key={cyclePark.getId()}
        onPress={() => {
          this.optionElementPressed(markerObject);
        }}>
        <Card style={this.style.rowElement}>
          <View style={this.style.rowContainer}>
            <View style={this.style.rowLeft}>
              <View style={this.style.rowPart}>
                <Text>{distStr}</Text>
              </View>

              <View style={this.style.rowPart}>
                <Image
                  style={this.style.rowPartImage}
                  source={this.getImage(cyclePark.getType())}
                />
              </View>

              <View style={this.style.rowPart}>
                <Image
                  opacity={cyclePark.isCovered() ? 1 : 0.3}
                  style={this.style.rowPartImage}
                  source={image_umbrella}
                />
              </View>

              <View style={this.style.rowPart}>
                <Text
                  style={{
                    height: '100%',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}>
                  {cyclePark.getSpaces()} Spaces
                </Text>
              </View>
            </View>

            <View style={this.style.rowRight}>
              <View style={this.style.rowPart}>
                <Image
                  opacity={isBookmark ? 1 : 0.3}
                  style={this.style.rowPartImage}
                  source={image_bookmark}
                />
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  }

  // this is very smelly
  isBookmarked(cyclepark_id) {
    for (let i = this.props.bookmarkedMarkers.length - 1; i >= 0; i--) {
      let marker = this.props.bookmarkedMarkers[i];
      if (marker.cyclepark.getId() === cyclepark_id) {
        return true;
      }
    }
    return false;
  }

  getOrderedMarkers() {
    console.log('ListViewPage.getOrderedMarkers()');
    console.log('this.state.onlyShowBookmarks', this.state.onlyShowBookmarks);

    const searchedMarkers =
      this.state.onlyShowBookmarks ||
      !Array.isArray(this.props.searchedMarkers) ||
      this.props.searchedMarkers.length === 0
        ? []
        : this.props.searchedMarkers;

    console.log('searchedMarkers.length', searchedMarkers.length);

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
    return allMarkers;
  }

  bookmarksOnlyButtonOnPress() {
    this.setState({
      ...this.state,
      onlyShowBookmarks: !this.state.onlyShowBookmarks,
    });
    console.log('this.state.onlyShowBookmarks', this.state.onlyShowBookmarks);
  }

  toggleBookmarksButton() {
    return (
      <TouchableOpacity
        onPress={() => {
          this.bookmarksOnlyButtonOnPress();
        }}>
        <Card style={this.style.rowElement}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              textAlignVertical: 'center',
            }}>
            {this.state.onlyShowBookmarks ? 'All results' : 'Bookmarks only'}
          </Text>
        </Card>
      </TouchableOpacity>
    );
  }

  render() {
    const allMarkers = this.getOrderedMarkers();

    return (
      <SafeAreaView style={this.style.outer}>
        {this.toggleBookmarksButton()}
        <FlatList
          data={allMarkers}
          renderItem={markerObject => {
            return this.flatListRenderItem(markerObject);
          }}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    );
  }
}

export default ListViewPage;
