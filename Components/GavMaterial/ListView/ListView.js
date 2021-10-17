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

    this.markers = props.markers

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

  render(){
    return(
      //TODO continue replacing the list view part
      <SafeAreaView style={this.style.outer}>
        <FlatList 
          style={{
            backgroundColor: 'brown',
            flexDirection: 'column'
          }}
          data={this.markers}
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