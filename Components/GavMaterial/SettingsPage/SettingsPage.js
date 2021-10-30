import { file } from '@babel/types';
import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Button,
  Switch,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import FileHelper from '../../../GavClasses/FileHelper';
import themes from '../../../Theme';
import userSettings from '../../../UserSettings';


/**
 * props
 *  onBookmarksChanged
 */
class SettingsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alwaysShowImagesSwitchState: false,
      alwaysShowImagesSwitchEnabled: false,
    };

    // get current settings, enable switch when ready
    userSettings.get('alwaysShowImages').then(alwaysShowImages => {
      this.setState({
        ...this.state,
        alwaysShowImagesSwitchEnabled: true,
        alwaysShowImagesSwitchState: alwaysShowImages,
      });
    });

    this.onAlertConfirm.bind(this);
  }

  onAlertConfirm() {
    userSettings.set('bookmarks', []);
    Alert.alert('Bookmarks Cleared');
    typeof this.props.onBookmarksChanged === 'function'
      ? this.props.onBookmarksChanged()
      : null;
  }

  async locationPermissionButtonPressed() {
    console.log('SettingsPage.locationPermissionButtonPressed()');
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then(status => {
      console.log(
        'PermissionsAndroid.RESULTS.GRANTED',
        status,
        PermissionsAndroid.RESULTS.GRANTED,
      );
      userSettings.set(
        'canAccessDeviceLocation',
        status === PermissionsAndroid.RESULTS.GRANTED,
      );

      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'You have already given permission to access device location',
          `If you want to remove this, please do so in your device permission settings`,
          [{text: 'Ok'}],
        );
      }
    });
  }

  async testFileWrite(){

    console.log('===== testFileWrite =====')

    const now = new Date().toUTCString()

    const testFileContent = `the time is ${now} so cool!`
    const testFileName = 'testFileNameTwo.txt'
    const testDirectory = '/testdir'
    const testFilePath = `${testDirectory}/${testFileName}`

    const fileHelper = new FileHelper()

    // does the dir exists?
    console.log(`does ${testDirectory} exist?`)
    const dirExists = await fileHelper.exists( testDirectory )
    console.log(`dir ${testDirectory} ${dirExists ? 'does' : 'does not'} exist`)

    if(!dirExists){
      console.log('creating dir')
      const dirCreated = await fileHelper.mkDir( testDirectory )
      dirCreated
        ? console.log('created dir')
        : console.log('maybe created dir')
    }

    // write the file
    console.log('attempt to create file')
    const created = await fileHelper.writeFile( testFilePath, testFileContent )
    created
      ? console.log('created file')
      : console.log('maybe created file')

    // attempt to read the file
    console.log('attempt to read file')
    const fileContent = await fileHelper.readFile( testFilePath )
    fileContent
      ? console.log('fileContent', fileContent)
      : console.log('no file content found!')

    const tempPrintItems = async ( items, indentLevel = 0 )=>{
      items.forEach(async (item) =>{
        let type = ''
        item.isDirectory() && (type += 'd')
        item.isFile() && (type += 'f')

        let indents = Array(indentLevel)
        indents.fill('\t')

        let name = item.name
        console.log(`${indents.join('')}${type}: ${name}`)

        if(type === 'd'){
          indentLevel++
          let innerItems = await fileHelper.readDir( `/${name}` )
          tempPrintItems(innerItems, indentLevel )
        }

      })
    }

    // list all items
    const allItems = await fileHelper.readDir()
    tempPrintItems(allItems)

  }


  updateTFLDataButtonPressed() {
    console.log('SettingsPage.updateTFLDataButtonPressed()');

    const promptText = {
      title: 'Update TFL Data',
      desc: 'Are you sure you want to update TFL data? This will use a lot of data (approx 80mb) and add approx 6mb to local storage',
    };

    Alert.alert(promptText.title, promptText.desc, [
      {
        text: 'Update',
        onPress: () => {
          console.log('UPDATE DATA HERE');
          this.testFileWrite()
        },
      },
      {
        text: 'Cancel',
        onPress: () => {
          console.log('do nothing');
        },
        style: 'cancel',
      },
    ]);

    // use hardcoded data file by default
    // test reading from file storage
    // download and format file and put in file storage
    // use this file as the main tfl data file if it exists, else use default
  }

  async clearBookmarksButtonPressed() {
    console.log('SettingsPage.clearBookmarksButtonPressed()');

    const bookMarksArray = await userSettings.get('bookmarks');

    if (bookMarksArray.length < 1) {
      Alert.alert('You have no bookmarks');
      return;
    }

    Alert.alert(
      'Clear Bookmarks?',
      `Really delete ${bookMarksArray.length} bookmarks? This can't be undone.`,
      [
        {
          text: 'Clear',
          onPress: this.onAlertConfirm.bind(this),
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
    );
  }

  alwaysShowImagesChanged() {
    const newState = !this.state.alwaysShowImagesSwitchState;
    // change the state of the on-page button
    this.setState({alwaysShowImagesSwitchState: newState});
    // save the user setting
    userSettings.set('alwaysShowImages', newState);
  }

  render() {
    return (
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: themes.main.surface,
          flexDirection: 'column',
        }}>
        {/* text bit at the top */}
        <View
          style={{
            backgroundColor: themes.main.primary,
            height: '7%',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
          }}>
          <Text
            style={{
              color: themes.main.text.onPrimary,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            Settings
          </Text>
        </View>

        {/* clear bookmarks button */}
        <View
          style={{
            width: '100%',
            height: 100,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              color: themes.main.text.onSecondary,
              fontSize: 17,
              fontWeight: 'bold',
              textAlignVertical: 'center',
            }}>
            Clear bookmarks
          </Text>
          <View
            style={{
              width: 150,
            }}>
            <Button
              onPress={() => {
                this.clearBookmarksButtonPressed();
              }}
              title="Clear"
              color={themes.main.primary}
              accessibilityLabel="Clear bookmarks"
            />
          </View>
        </View>

        {/* always show images toggle */}
        <View
          style={{
            width: '100%',
            height: 100,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              color: themes.main.text.onSecondary,
              fontSize: 17,
              fontWeight: 'bold',
              textAlignVertical: 'center',
            }}>
            Always show images
          </Text>

          {this.state.alwaysShowImagesSwitchEnabled && (
            <View
              style={{
                width: 150,
              }}>
              <Switch
                trackColor={{
                  false: themes.main.secondaryVariant,
                  true: themes.main.secondary,
                }}
                thumbColor={true ? '#f5dd4b' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => {
                  // change switch state
                  this.alwaysShowImagesChanged();
                  this.setState({
                    alwaysShowImagesSwitchState:
                      !this.state.alwaysShowImagesSwitchState,
                  });
                }}
                value={this.state.alwaysShowImagesSwitchState}
              />
            </View>
          )}
        </View>

        {/* re-request location permission */}
        <View
          style={{
            width: '100%',
            height: 100,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              color: themes.main.text.onSecondary,
              fontSize: 17,
              fontWeight: 'bold',
              textAlignVertical: 'center',
            }}>
            Location permission
          </Text>
          <View
            style={{
              width: 150,
            }}>
            <Button
              onPress={() => {
                this.locationPermissionButtonPressed();
              }}
              title="Prompt"
              color={themes.main.primary}
              accessibilityLabel="Grant location permissions"
            />
          </View>
        </View>

        {/* update TFL data */}
        <View
          style={{
            width: '100%',
            height: 100,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <Text
            style={{
              color: themes.main.text.onSecondary,
              fontSize: 17,
              fontWeight: 'bold',
              textAlignVertical: 'center',
            }}>
            Update TFL Data
          </Text>
          <View
            style={{
              width: 150,
            }}>
            <Button
              onPress={() => {
                this.updateTFLDataButtonPressed();
              }}
              title="Update"
              color={themes.main.primary}
              accessibilityLabel="Update TFL Data"
            />
          </View>
        </View>
      </View>
    );
  }
}

export default SettingsPage;
