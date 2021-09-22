import React, { Component } from "react"
import { View, StyleSheet, Text, Switch, Button, Alert, TouchableOpacity } from "react-native"
import Card from "./Components/Card"
import themes from "./Theme"
import userSettings from "./UserSettings"

class SettingsPage extends Component{
  constructor(props){
    super(props)

    this.state = {
      alwaysShowImagesSwitchState: false,
      alwaysShowImagesSwitchEnabled: false,
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
        // height: '10%',
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

    // get current settings
    userSettings.get('alwaysShowImages').then( alwaysShowImages => {
      this.setState({
        ...this.state,
        alwaysShowImagesSwitchEnabled: true,
        alwaysShowImagesSwitchState: alwaysShowImages
      });
    })

    this.onAlertConfirm.bind(this)

  }

  alwaysShowImagesChanged(){
    const newState = !this.state.alwaysShowImagesSwitchState
    // change the state of the on-page button
    this.setState({alwaysShowImagesSwitchState: newState});
    // save the user setting
    userSettings.set('alwaysShowImages', newState)
  }

  onAlertConfirm(){
    // cam't use this.methodName here???
    userSettings.set('bookmarks', [])
    //TODO alert user
    Alert.alert('Bookmarks Cleared');
    console.log('typeof this', typeof this);

    if(typeof this.props.onBookmarksChanged === 'function'){
      this.props.onBookmarksChanged()
    }
  }

  async clearBookmarksButtonPressed(){

    const bookMarksArray = await userSettings.get('bookmarks')

    if(bookMarksArray.length < 1){
      Alert.alert('You have no bookmarks');
      return;
    }

    Alert.alert(
      "Clear Bookmarks?",
      `Really delete ${bookMarksArray.length} bookmarks? This can't be undone.`,
      [
        {
          text: "Clear",
          onPress: this.onAlertConfirm.bind(this)
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
      ]
    );

  }

  clearBookmarks(){
    // just set it empty!
    userSettings.set('bookmarks', [])
    //TODO alert user
    Alert.alert('Bookmarks Cleared');
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
              onPress={()=>{this.clearBookmarksButtonPressed()}}
              title={"Clear"}
              color={themes.main.secondary}
              accessibilityLabel="Clear bookmarks"
             />
          </View>
        </Card>

        <Card style={this.styles.settingRow}>
          <View style={this.styles.settingTextContainer}>
            <Text style={this.styles.settingText}>Always show images</Text>
          </View>
          <View style={this.styles.settingControlContainer}>

            {
              // Don't show switch until it's enabled anyway
              this.state.alwaysShowImagesSwitchEnabled
              && <Switch
                disabled={!this.state.alwaysShowImagesSwitchEnabled}
                trackColor={{false: '#767577', true: '#81b0ff'}}
                thumbColor={themes.main.secondary}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  this.alwaysShowImagesChanged()
                  this.setState({alwaysShowImagesSwitchState: !this.state.alwaysShowImagesSwitchState});
                }}
                value={this.state.alwaysShowImagesSwitchState}
              />
            }
            
            </View>
        </Card>

        <Card style={this.styles.settingRow}>
          <TouchableOpacity onPress={()=>{
            userSettings.get('alwaysShowImages').then( val => {
              console.log('alwaysShowImages', val);
            })
            userSettings.get('bookmarks').then( val => {
              console.log('bookmarks', val);
            })
          }}>
            <Text style={{color:'black'}}>Tap to log settings</Text>

          </TouchableOpacity>
        </Card>

      </View>
    );
  }
  
}

export default SettingsPage