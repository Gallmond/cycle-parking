import React, { Component } from "react"
import { View, StyleSheet, Text, Switch, Button } from "react-native"
import Card from "./Components/Card"
import themes from "./Theme"

class SettingsPage extends Component{
  constructor(props){
    super(props)

    this.state = {
      switchValue: false,
      switchEnabled: true,
    }

    this.styles = StyleSheet.create({
      outer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: themes.main.background,
        flexDirection: 'column',
        paddingLeft:10,
        paddingRight:10,
      },
      settingRow:{
        height: '10%',
        marginTop: '5%',

        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      settingTextContainer:{
        flex:7,
        justifyContent: 'center',
      },
      settingText:{
        fontSize: 25,
        color: themes.main.text.onSurface,
        textAlign: 'center',
      },
      settingControlContainer:{
        justifyContent: 'center',
        flex:3,
      },


    })
  }

  clearBookmarksButtonPressed(){
    console.log('//TODO clearBookmarksButtonPressed')
  }

  render(){
    return (
      <View style={this.styles.outer}>
        {/* item row */}
        <Card style={this.styles.settingRow}>
          <View style={this.styles.settingTextContainer}>
            <Text style={this.styles.settingText}>Clear bookmarks</Text>
          </View>
          <View style={this.styles.settingControlContainer}>
            <Button
              style={{alignSelf:'stretch'}}
              onPress={this.clearBookmarksButtonPressed}
              title={"Clear"}
              color={themes.main.secondary}
              accessibilityLabel="Clear bookmarks"
             />

            {/* <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={this.state.switchEnabled ? themes.main.secondary : 'gray'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                this.setState({switchValue: !this.state.switchValue});
              }}
              value={this.state.switchValue}
            /> */}
          </View>
        </Card>

        <Card style={this.styles.settingRow}>
          <Text style={{color:'black'}}>111</Text>
        </Card>

        <Card style={this.styles.settingRow}>
          <Text style={{color:'black'}}>222</Text>
        </Card>

      </View>
    );
  }
  
}

export default SettingsPage