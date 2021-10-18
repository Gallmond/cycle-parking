import React, { Component } from "react"
import { Switch, Text, StyleSheet, SafeAreaView, FlatList, View, Button } from "react-native"
import themes from "../../../Theme"
import ListItem from "./ListItem"

/**
 * props:
 *  searchedMarkers
 *  bookmarkedMarkers
 *  optionSelected
 */
class ListView extends Component{

  constructor(props){
    super(props)

    this.searchedMarkers = props.searchedMarkers
    this.bookmarkedMarkers = props.bookmarkedMarkers
    this.optionSelected = props.optionSelected

    const defaultStyles = {
      outer: {
        ...StyleSheet.absoluteFillObject,
        width: '65%',
        backgroundColor: themes.main.background,
        flexDirection: 'column',
      },
    }

    this.style = StyleSheet.create(defaultStyles)

    this.state = {
      onlyBookmarks: false
    }

  }

  /**
   * combine bookmarked and search results markers
   */
  combineAndOrderMarkers(){

    this.bookmarkedMarkers.forEach(marker => {
      marker.cyclepark.isBookmark = true
    })

    const allMarkers = this.state.onlyBookmarks
      ? [...this.bookmarkedMarkers]
      : [ ...this.searchedMarkers, ...this.bookmarkedMarkers, ]

    allMarkers.sort((a, b) => {
      let a_dist = a.cyclepark.getDistance()
      let b_dist = b.cyclepark.getDistance()

      // if distance is null it should go first (probably a bookmark)
      if (a_dist === null) a_dist = -65000
      if (b_dist === null) b_dist = -65000

      // a is less
      if (a_dist < b_dist) return -1

      // b is less
      if (a_dist > b_dist) return 1

      // equal
      return 0
    })

    return allMarkers
  }

  render(){
    return(
      //TODO continue replacing the list view part
      <SafeAreaView style={this.style.outer}>

        {/* top text bit */}
        <View style={{
          backgroundColor: themes.main.primary,
          height: '7%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10
        }}>

          <Text style={{
            color: themes.main.text.onPrimary,
            fontSize: 20,
            fontWeight: 'bold'
          }}>List view</Text>

          {/* <Button title="Bookmarks" disabled={true} /> */}

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Text style={{
              color: themes.main.text.onPrimary,
              fontSize: 15,
            }}>Bookmarks</Text>
            <Switch
              trackColor={{ false: themes.main.secondaryVariant, true: themes.main.secondary }}
              thumbColor={true ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={()=>{
                this.setState({onlyBookmarks: !this.state.onlyBookmarks})
              }}
              value={this.state.onlyBookmarks}
            />
          </View>

        </View>

        {/* scrollable list */}
        <FlatList 
          style={{
            flexDirection: 'column'
          }}
          data={this.combineAndOrderMarkers()}
          renderItem={(item)=>{
           return <ListItem
            onPress={this.optionSelected ? this.optionSelected : null}
            marker={item.item}/> 
          }}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    )
  }

}

export default ListView