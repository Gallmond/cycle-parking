/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { useState, useRef } from 'react';
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

import cycleparkingJson from './cycleparking-tools/cycleparking.json'
const cycleParking = new CycleParking( true );
cycleParking.setData( cycleparkingJson )

// image sources
const image_info = require(`./images/info.png`)

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

  // all markers
  const [markers, setMarkers] = useState([])

  // store the currently selected marker here
  const [selectedMarker, setSelectedMarker] = useState(null)

  // keep track of the region, we use this for latitudeDelta and calculating circle width
  const [mapRegion, setRegion] = useState(null)

  const [displayInfo, setDisplayInfo] = useState(false)

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
  const renderMarker = ( marker ) => {
    return ( 
      <Marker onPress={()=>{onMarkerPress( marker )}} {...marker} >
        <Callout title={marker.title} description={marker.description} />
      </Marker> 
    )
  }

  // When the region changes, update our copy of it
  const onRegionChangeCompleteHandler = (e) => {
    setRegion(e)
  }

  // pan the camera to a given lat lon over a given time
  const setCameraOver = (lat, lon, duration_ms = 500) => {
    mapRef.current.animateCamera({
      center:{
        latitude: lat,
        longitude: lon
      }
    },{duration:duration_ms})
  }

  // when the map itself is pressed
  const onPressHandler = async (e) => {

    const tapped_lat = e.nativeEvent.coordinate.latitude
    const tapped_lon = e.nativeEvent.coordinate.longitude

    // draw circle
    const radius = drawCircleToFitWidth(tapped_lat, tapped_lon)

    // get cycle parking and add it to the map
    cycleParking.getCycleParksInRange( tapped_lat, tapped_lon, radius ).then( putCycleParkMarkersOnMap ).catch( console.log ) 
    
    // centre camera here
    setCameraOver(tapped_lat, tapped_lon, 500)

    // clear the selectedMarker if any is set
    selectedMarker && setSelectedMarker( null )

  }

  // create markers for a given set of CyclePark objects
  const putCycleParkMarkersOnMap = ( cycleparks ) => {
    const new_markers = []
    cycleparks.forEach( cyclepark => {
    
      new_markers.push({
        id: cyclepark.getId(), // for the react id
        key: cyclepark.getId(), // for the react key
        coordinate: {
          latitude: cyclepark.getLat(),
          longitude: cyclepark.getLon()
        },
        cyclepark: cyclepark,
        title: cyclepark.getName(),
        description: `${cyclepark.getType()} (${cyclepark.getSpaces()} spaces) (${!cyclepark.isSecure() ? 'not ' : ''}secure)`
      })
    })

    setMarkers( new_markers )
  }


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
    const new_radius = Math.min(latitudeDeltaToMetres(latitudeDelta) / 5, MAX_CIRCLE_RADIUS_METRES);
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
    console.log('toggleInfoPane')
    setDisplayInfo( !displayInfo )
  }


  const onMarkerPress = (e) => {
    setSelectedMarker( e );
  }

  const showInstructions = (e) => {
    console.log('//TODO show instructions page')
  }

  //TODO show pane on marker selected

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
          }}
        >

          {/* Draw the markers, or cluster marker */}
          {markers.map( marker => renderMarker( marker ) )}

          {/* Draw the circle if it's visible */}
          {circleProps.visible && <Circle  {...circleProps} />}

        </MapView>

        {/* more info button */}
        <TouchableOpacity style={styles.instructionsButton} onPress={showInstructions}>
          <Image style={styles.instructionsButtonImage} source={image_info} />
        </TouchableOpacity>

        {
        displayInfo
        && selectedMarker
        && <CycleParkingInformationPage 
          style={{...StyleSheet.absoluteFillObject}} 
          cyclePark={selectedMarker.cyclepark} 
        />
          }

      </View>

      {/* draw an info pane if there is a marker selected */}
      {selectedMarker && <InfoPane
        marker={selectedMarker}
        onShowInfoPane={toggleInfoPane}
      />}

    </View>
  );
};

const styles = StyleSheet.create({
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


