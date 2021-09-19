import React, {Component} from "react"
import { StyleSheet, View, Text, TouchableOpacity } from "react-native"
import Card from "./Components/Card"
import themes from "./Theme"

/**
 * searchedMarkers
 * bookmarkedMarkers
 * optionSelected
 */
class ListViewPage extends Component{

  constructor(props){
    super(props)
  
    this.style = StyleSheet.create({
      outer:{
        ...StyleSheet.absoluteFillObject,
        width:'80%',
        backgroundColor: themes.main.background,

        flexDirection: 'column'
      },
      rowElement:{
        height: 50,
        width: '100%',
      }
    });

  }

  optionElementPressed( markerObject ){
    if(this.props.optionSelected){
      this.props.optionSelected( markerObject )
    }
  }

  optionElement( markerObject ){

    const cyclePark = markerObject.cyclepark
    const typeName = cyclePark.getType()
    const spaces = cyclePark.getSpaces()
    const name = cyclePark.getName()
    const dist = cyclePark.getDistance() // metres
    const km = (dist / 1000).toFixed(1)

    const str = `${typeName} (${spaces}): ${km} km`
    
    return(
      <TouchableOpacity key={cyclePark.getId()} onPress={()=>{this.optionElementPressed( markerObject )}}>
        <Card>
          <Text>{str}</Text>
        </Card>
      </TouchableOpacity>
    )
  }

  render(){

    const searchedMarkers = !Array.isArray(this.props.searchedMarkers) || this.props.searchedMarkers.length === 0
        ? []
        : this.props.searchedMarkers

    const bookmarkedMarkers = !Array.isArray(this.props.bookmarkedMarkers) || this.props.bookmarkedMarkers.length === 0
        ? []
        : this.props.bookmarkedMarkers

    const allMarkers = [...searchedMarkers, ...bookmarkedMarkers]
    allMarkers.sort((a, b) => {
      let a_dist = a.cyclepark.getDistance()
      let b_dist = b.cyclepark.getDistance()

      // if distance is null it should go first (probably a bookmark)
      if(a_dist === null) a_dist = -65000
      if(b_dist === null) b_dist = -65000

      // a is less
      if( a_dist < b_dist ) return -1

      // b is less
      if( a_dist > b_dist ) return 1

      // equal
      return 0

    });


    return(
      <View style={this.style.outer}>
        
        {allMarkers.map( markerObject => this.optionElement( markerObject ) )}

        {/* {this.props.searchedMarkers.map( this.optionElement )}
        {this.props.bookmarkedMarkers.map( this.optionElement )} */}

      </View>
    )
  }

}

export default ListViewPage