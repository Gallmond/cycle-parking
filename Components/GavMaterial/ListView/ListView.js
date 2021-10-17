import React, { Component } from "react"
import { StyleSheet, SafeAreaView, FlatList } from "react-native"
import themes from "../../../Theme"
import ListItem from "./ListItem"

/**
 * props:
 *  markers
 */
class ListView extends Component{

  constructor(props){
    super(props)

    this.searchedMarkers = props.searchedMarkers
    this.bookmarkedMarkers = props.bookmarkedMarkers

    const defaultStyles = {
      outer: {
        ...StyleSheet.absoluteFillObject,
        width: '65%',
        backgroundColor: themes.main.background,
        flexDirection: 'column',
      },
    }

    this.style = StyleSheet.create(defaultStyles)

  }

  /**
   * combine bookmarked and search results markers
   */
  combineAndOrderMarkers(){
    const allMarkers = [
      ...this.searchedMarkers,
      ...this.bookmarkedMarkers,
    ];

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
        <FlatList 
          style={{
            backgroundColor: 'brown',
            flexDirection: 'column'
          }}
          data={this.combineAndOrderMarkers()}
          renderItem={(item)=>{
           return <ListItem
            marker={item.item}/> 
          }}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    )
  }

}

export default ListView