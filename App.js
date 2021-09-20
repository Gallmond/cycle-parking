/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  Image,
  Button,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import MapView from 'react-native-map-clustering';
import { Callout, Circle, Marker } from "react-native-maps";

import { CycleParking } from "./cycleparking-tools/CycleParking";
import InfoPane from './Components/InfoPane/InfoPane.js';
import CycleParkingInformationPage from './CycleParkingInformationPage';
import InstructionsPage from './InstructionsPage';

import cycleparkingJson from './cycleparking-tools/cycleparking.json'
import cycleparkingEnumJson from './cycleparking-tools/cycleparking_enums.json'
import userSettings from './UserSettings';
import SettingsPage from './SettingsPage';
import ListViewPage from './ListViewPage';
const cycleParking = new CycleParking( true );
cycleParking.setData( cycleparkingJson ).setEnums( cycleparkingEnumJson )

// image sources
const image_info = require(`./images/info.png`)
const image_cog = require(`./images/cog.png`)

// unchanging settings
const WIN_WIDTH = Dimensions.get('window').width
const BARNES_ROUNDABOUT_LATLON = [51.470624, -0.255804]
const MAX_CIRCLE_RADIUS_METRES = 1000
// https://mapstyle.withgoogle.com/
const GOOGLE_MAP_STYLE = [
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]

// helper functions
const latitudeDeltaToMetres = ( latitudeDelta ) => {
  const miles = latitudeDelta * 69 // 1 degree is approx 69 miles
  const metres = miles / 0.00062137 // 0.00001° = 1.11 m
  return metres
}

const App = () => {

  // reference to the map, use this to call map methods
  const mapRef = useRef(null);
  const tappedMarkerRef = useRef(null);

  // all markers
  const [searchedMarkers, setSearchedMarkers] = useState([])
  const [bookmarkedMarkers, setBookmarkedMarkers] = useState([])
  const [bookmarkedCycleParkIds, setBookmarkedCycleParkIds] = useState([])

  // load bookmarks only once
  useEffect(() => {
    updateDrawableBookmarks();
  }, []); // the array indicates when this should re-run (ie, no states changing so don't re-run)
  
  const updateDrawableBookmarks = () => {
    userSettings.get('bookmarks').then( cycleParkIds => {
      setBookmarkedCycleParkIds(cycleParkIds)

      // check if any of these exist in the already drawn searchedMarkers
      const temp_searchedMarkers = [...searchedMarkers]
      for (let i = temp_searchedMarkers.length - 1; i >= 0; i--) {
        if( cycleParkIds.indexOf(temp_searchedMarkers[i].cyclepark.getId()) !== -1 ){
          temp_searchedMarkers.splice(i, 1)
        }
      }
      setSearchedMarkers( temp_searchedMarkers )

      cycleParking.getCycleParksById( cycleParkIds ).then( putBookmarkMarkersOnMap ).catch( console.log ) 
    })
  }


  // store the currently selected marker here
  const [selectedMarker, setSelectedMarker] = useState(null)

  // keep track of the region, we use this for latitudeDelta and calculating circle width
  const [mapRegion, setRegion] = useState(null)

  // display the info pane
  const [displayInfo, setDisplayInfo] = useState(false)

  // display the settings page
  const [settingsPageVisible, setSettingsPageVisible] = useState(false)
  
  // display the list view
  const [listViewVisible, setListViewVisible] = useState(false)


  // camera
  const [mapCamera, setMapCamera] = useState({
    center: {
      latitude: BARNES_ROUNDABOUT_LATLON[0],
      longitude: BARNES_ROUNDABOUT_LATLON[1],
    },
    pitch: 0,
    heading: 0,
    altitude: 5,
    zoom: 16, // 0 - 20
  });

  // current circle settings
  const [circleProps, setCircleProps] = useState({
    visible: false,
    center:{latitude:BARNES_ROUNDABOUT_LATLON[0], longitude: BARNES_ROUNDABOUT_LATLON[1]},
    radius:100
  })

  
  // some formatting to return marker
  const renderMarker = ( marker, highlight_pin = false ) => {
    const markerprops = {...marker, pinColor: highlight_pin ? 'blue' : 'red'}
    return ( 
      <Marker onPress={(comp, e)=>{onMarkerPress(comp, marker )}} {...markerprops} >
        <Callout title={marker.title} description={marker.description} />
      </Marker> 
    )
  }

  // When the region changes, update our copy of it
  const onRegionChangeCompleteHandler = (e) => {
    setRegion(e)
  }

  // pan the camera to a given lat lon over a given time
  const setCameraOver = (lat, lon, duration_ms = 500, new_zoom = null) => {
    
    const newCameraConfig = {
      center:{
        latitude: lat,
        longitude: lon
      }
    }

    if(new_zoom){
      newCameraConfig['zoom'] = new_zoom
    }

    mapRef.current.animateCamera(newCameraConfig,{duration:duration_ms})
    
  }

  // when the map itself is pressed
  const onPressHandler = async (e) => {

    const tapped_lat = e.nativeEvent.coordinate.latitude
    const tapped_lon = e.nativeEvent.coordinate.longitude

    // draw circle
    const radius = drawCircleToFitWidth(tapped_lat, tapped_lon)

    console.log(`map tapped ${tapped_lat}, ${tapped_lon} radius: ${radius}`)

    // get cycle parking and add it to the map
    cycleParking.getCycleParksInRange( tapped_lat, tapped_lon, radius ).then( putCycleParkMarkersOnMap ).catch( console.log ) 
    
    // put bookmarked markers on
    cycleParking.getCycleParksById( bookmarkedCycleParkIds ).then( putBookmarkMarkersOnMap ).catch( console.log ) 

    // centre camera here
    setCameraOver(tapped_lat, tapped_lon, 500)

    // clear the selectedMarker if any is set
    selectedMarker && setSelectedMarker( null )

  }


  const formatMarkerFromCyclePark = ( cyclepark_object ) => {
    return {
      id: cyclepark_object.getId(), // for the react id
      key: cyclepark_object.getId(), // for the react key
      coordinate: {
        latitude: cyclepark_object.getLat(),
        longitude: cyclepark_object.getLon()
      },
      cyclepark: cyclepark_object,
      // callout options, remove to disable
      // title: cyclepark_object.getName(),
      // description: `${cyclepark_object.getType()} (${cyclepark_object.getSpaces()} spaces) (${!cyclepark_object.isSecure() ? 'not ' : ''}secure)`
    }
  }


  // create markers for a given set of CyclePark objects
  const putBookmarkMarkersOnMap = ( cycleparks ) => {
    const new_markers = []
    cycleparks.forEach( cyclepark => {
        new_markers.push( formatMarkerFromCyclePark(cyclepark) )
    })
    setBookmarkedMarkers( new_markers )
  }
  
  // create markers for a given set of CyclePark objects
  const putCycleParkMarkersOnMap = ( cycleparks, are_bookmarks = false ) => {
    const new_markers = []
    cycleparks.forEach( cyclepark => {
      // skip any that exist in the bookmarks
      if( bookmarkedCycleParkIds.includes( cyclepark.getId() ) ) return;
      new_markers.push( formatMarkerFromCyclePark(cyclepark) )
    })
    setSearchedMarkers( new_markers )
  }


  // const getAllMarkers = () => {
  //   return markers;
  // }


  /**
   * 
   * @param {number} lat 
   * @param {number} lon 
   * @returns {number} calculated radius in METRES
   */
  const drawCircleToFitWidth = (lat, lon) => {
    const latitudeDelta = mapRegion.latitudeDelta;
    const new_centre = {
      latitude: lat,
      longitude: lon,
    };
    const new_radius = Math.min(latitudeDeltaToMetres(latitudeDelta) / 3, MAX_CIRCLE_RADIUS_METRES);
    setCircleProps(prevState => {
      const newState = {
        ...prevState,
        visible: true,
        center: new_centre,
        radius: new_radius,
      };
      return newState;
    });
    return new_radius
  };


  const toggleInfoPane = (e) => {
    setDisplayInfo( !displayInfo )
  }


  const onMarkerPress = (comp, e) => {
    console.log('comp', comp);
    console.log('Object.keys(comp)', Object.keys(comp));

    setSelectedMarker( e );
  }

  const toggleSettingsPage = () => {
    console.log('Toggle Settings Page!!!')
    setSettingsPageVisible( !settingsPageVisible )
  }

  const toggleListView = () => {
    console.log('Toggle List View!!!')
    setListViewVisible( !listViewVisible )
  }


  return (
    <View style={styles.container}>
      <View style={styles.map_container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          customMapStyle={GOOGLE_MAP_STYLE}
          camera={mapCamera}
          onPress={onPressHandler}
          onRegionChangeComplete={onRegionChangeCompleteHandler}
          showsPointsOfInterest={false}
          showsBuildings={false}
          showsIndoors={false}
          // cluster options
          clusterColor={'#B52929'}
          spiralEnabled={false}
          maxZoom={18}
          radius={WIN_WIDTH * 0.075} // pixels, default is 6% of window width
          // cluster fails without an initial region
          initialRegion={{
            latitude: 51.5079,
            longitude: -0.0877,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          {/* Draw the markers, or cluster marker */}
          {/* {getAllMarkers().map( marker => renderMarker( marker ) )} */}
          {searchedMarkers.map(marker => renderMarker(marker))}
          {bookmarkedMarkers.map(marker => renderMarker(marker, true))}

          {/* Draw the circle if it's visible */}
          {circleProps.visible && <Circle {...circleProps} />}
        </MapView>

        {displayInfo && selectedMarker && (
          <CycleParkingInformationPage
            style={{...StyleSheet.absoluteFillObject}}
            cyclePark={selectedMarker.cyclepark}
            onBookmarksChanged={updateDrawableBookmarks}
          />
        )}
      </View>

      {/* draw an info pane if there is a marker selected */}
      {selectedMarker && (
        <InfoPane marker={selectedMarker} onShowInfoPane={toggleInfoPane} />
      )}

      {settingsPageVisible && <SettingsPage />}

      {/* settings button //TODO move this */}
      <TouchableOpacity
        style={{width: 50, height: 50, position: 'absolute', left: 0, top:0}}
        onPress={toggleSettingsPage}>
        <Image style={{flex:1, height:undefined, width:undefined}} source={image_cog} />
      </TouchableOpacity>

      {listViewVisible && <ListViewPage
        searchedMarkers={searchedMarkers}
        bookmarkedMarkers={bookmarkedMarkers}
        optionSelected={( markerObject )=>{
          // move camera here
          const lat = markerObject.coordinate.latitude;
          const lon = markerObject.coordinate.longitude;
          setCameraOver( lat, lon, 500, 19 )  
          setSelectedMarker( markerObject )
          setListViewVisible( false )
        }}
       />}
      
      {/* list view button //TODO move this */}
      <TouchableOpacity
        style={{position:'absolute', top:'50%', left:0, backgroundColor: 'red'}}
        onPress={toggleListView}>
        <Text>SHOW LIST VIEW</Text>
      </TouchableOpacity> 

    </View>
  );
};

const styles = StyleSheet.create({
  instructionsPage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'green'
  },
  instructionsButton:{
    width: '10%',
    aspectRatio: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
  },
  instructionsButtonImage:{
    resizeMode: 'center',
    width: '100%',
    height: '100%'
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map_container: {
    // ...StyleSheet.absoluteFillObject,
    width:'100%', height:'100%',
    flex:9,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  highlight: {
    fontSize: 14,
    color: 'white'
  },
  mapCluster: {
    width: 22,
    height: 22,
    borderRadius: 22/2,
    backgroundColor: 'red'
  },
  mapClusterText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center', // <-- the magic
  }
 });

export default App;


