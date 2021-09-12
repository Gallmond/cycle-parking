import React, { Component } from "react";
import { StyleSheet, View, SectionList, Text } from "react-native";

class InstructionsPage extends Component{
  constructor(props){
    super(props)

    this.style = StyleSheet.create({
      instructionsPage: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'green',
        paddingTop: '10%'
      },
      sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 14,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
      },
      item: {
        // padding: 10,
        marginTop: 10,
        marginBottom: 5,
        fontSize: 18,
        height: 44,
        width: '100%',
        flex: 1,
        flexWrap: 'wrap'
      },
    })

    this.listSections = [
      {title: 'Navigation', data: [
        'Drag the map to pan it around, pinch to zoom and rotate',
        'Tap the map to search for cycling points in this area. here is some more text hopefully we have a line break',
        'If there are many points close together, it will cluster them.',
        'Tap on a cluster to zoom in.',
      ]},
      {title: 'Cycle Parking', data: [
        'Tap on a marker to bring up an icon bar of information including:',
        'The type of stand',
        'The spaces it has',
        'If it is secure',
        'The Route button will open directions to here in Google Maps',
        'More Info'
      ]},
      {title: 'More information page', data: [
        'Shows all the data we have about the stand including',
        'Is it covered?',
        'Is it multi-tiered?',
        'Pictures of the stand (if any)',
      ]},
    ];

  }


  renderListItem(item){
    return(
      <View  style={{flexDirection:'row'}}> 
        <Text  style={this.style.item}>
          {item}
        </Text>
      </View>
    )
  }


  render(){
    return(
      <View style={this.style.instructionsPage}>
        <SectionList
        sections={this.listSections}
        renderItem={({item}) => { return this.renderListItem(item) }}
        renderSectionHeader={({section}) => <Text style={this.style.sectionHeader}>{section.title}</Text>}
        keyExtractor={(item, index) => index}
        />
      </View>
    )
  }

}

export default InstructionsPage