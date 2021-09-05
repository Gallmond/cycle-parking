/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { useState, useRef } from 'react';
import type {Node} from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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
import InfoPane from './InfoPane.js';

const cycleParking = new CycleParking( true );

const win_width = Dimensions.get('window').width
const win_height = Dimensions.get('window').height

const MAX_CIRCLE_RADIUS_METRES = 1000

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

  // https://mapstyle.withgoogle.com/
  const customGoogleMapStyle = [
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


  const mapRef = useRef(null);
  const infoPaneRef = useRef(null);

  const barnes_roundabout_latlon = [51.470624, -0.255804];

  const latitudeDeltaToMetres = ( latitudeDelta ) => {
    // 0.00001° = 1.11 m
    // 1degree is approx 69 miles
    const miles = latitudeDelta * 69
    const metres = miles / 0.00062137
    return metres
  }

  const [markers, setMarkers] = useState([])


  const clusterOnPressHandler = ( e ) => {
    console.log('clusterOnPressHandler e.nativeEvent', e.nativeEvent)
    const { action, coordinate } = e.nativeEvent
    
    // e.nativeEvent {"action": "marker-press", "coordinate": {"latitude": 51.46608618252856, "longitude": -0.2671480178833008}, "id": null, "position": {"x": 649, "y": 1128}}
    // if(action === "marker-press"){
    //   zoomCameraTo(coordinate.latitude, coordinate.longitude, 18)
    // }
  
  }

  const _renderMarker = ( marker ) => {
    // console.log( '_renderMarker marker', marker )
    return ( <Marker onPress={()=>{onMarkerPress(marker)}} {...marker} /> )
  }

  // circle props
  const [circleProps, setCircleProps] = useState({
    visible: false,
    center:{latitude:barnes_roundabout_latlon[0], longitude: barnes_roundabout_latlon[1]},
    radius:100
  })

  // keep track of the region, we need the deltas
  const [mapRegion, setRegion] = useState(null)
  const onRegionChangeCompleteHandler = (e) => {
    // console.log('onRegionChangeCompleteHandler e', e)
    // {"latitude": 51.472480300910206, "latitudeDelta": 0.010265127233381577, "longitude": -0.2561464346945286, "longitudeDelta": 0.007725097239017487}
    setRegion(e)
  }

  const [mapCamera, setMapCamera] = useState({
    center: {
      latitude: barnes_roundabout_latlon[0],
      longitude: barnes_roundabout_latlon[1],
    },
    pitch: 0,
    heading: 0,
    altitude: 5,
    zoom: 16, // 0 - 20
  });
  const setCameraOver = (lat, lon, duration_ms = 500) => {
    mapRef.current.animateCamera({
      center:{
        latitude: lat,
        longitude: lon
      }
    },{duration:duration_ms})
  }
  const zoomCameraTo = (lat, lon, zoom, duration_ms = 500) => {
    mapRef.current.animateCamera({
      center:{
        latitude: lat,
        longitude: lon
      },
      zoom: zoom
    },{duration:duration_ms})
  }


  const onPressHandler = async (e) => {
    console.log('onPressHandler e.nativeEvent', e.nativeEvent)
    // {"action": "press", "coordinate": {"latitude": 51.4741348880686, "longitude": -0.25690030306577677}, "position": {"x": 435, "y": 781}}

    // infoPaneRef.current.hide()

    const tapped_lat = e.nativeEvent.coordinate.latitude
    const tapped_lon = e.nativeEvent.coordinate.longitude

    // draw circle
    const radius = drawCircleToFitWidth(tapped_lat, tapped_lon)

    // get cycle parking
    cycleParking.getCycleParksInRange( tapped_lat, tapped_lon, radius ).then( putCycleParkMarkersOnMap ).catch( console.log ) 
    
    // centre camera here
    setCameraOver(tapped_lat, tapped_lon, 500)

    // dismiss the infopane
    infoPaneRef.current.isHidden() || infoPaneRef.current.hide()

  }

  const putCycleParkMarkersOnMap = (places) => {
    const new_markers = []
    let i = 0
    places.forEach( place => {
    
      const {
        id,
        name,
        standtype,
        spaces,
        secure
      } = place

      new_markers.push({
        id: id, // for the react id
        key: id, // for the react key
        coordinate: {
          latitude: place.lat,
          longitude: place.lon
        },
        title: name,
        description: `${standtype} (${spaces} spaces) (${secure === 'FALSE' ? 'not ' : ''}secure)`
      })
    })

    setMarkers( new_markers )
  }


  const markerOnCalloutPressHandler = (e) => {
    console.log('markerOnCalloutPressHandler e.nativeEvent', e.nativeEvent)
    console.log('markerOnCalloutPressHandler e', e)
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

  const getMapContainerStyles = () => {
    // is infopane hidden?
    const this_style = {...styles.map_container}
    if( infoPaneRef && infoPaneRef.current && infoPaneRef.current.isHidden()){
      this_style.height = '100%'
    }else{
      this_style.height = '90%'
    }
    return this_style
  }


  const onMarkerPress = (e) => {
    console.log('onMarkerPress e', e)    
    // e.nativeEvent {"action": "marker-press", "coordinate": {"latitude": 51.470485, "longitude": -0.255915}, "id": null, "position": {"x": 501, "y": 1473}}   
    let cool_text = `${e.title} - ${e.description}`
    infoPaneRef.current.setTextAndShow( cool_text )
  }

  //TODO show pane on marker selected

  return (
    <View style={styles.container}>
      <View style={getMapContainerStyles()}>
        <MapView
          ref={mapRef}
          style={styles.map}
          customMapStyle={customGoogleMapStyle}
          camera={mapCamera}
          onPress={onPressHandler}
          onRegionChangeComplete={onRegionChangeCompleteHandler}

          showsPointsOfInterest={false}
          showsBuildings={false}
          showsIndoors={false}

          // renderCluster={_renderCluster}

          clusterColor={'#B52929'}
          spiralEnabled={false}
          maxZoom={18}
          radius={win_width * 0.025} // pixels, default is 6% of window width

          initialRegion={{
            latitude: 51.5079,
            longitude: -0.0877,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {markers.map( marker => _renderMarker( marker ) )}

          {/* {markers.map( marker => <Marker onCalloutPress={markerOnCalloutPressHandler} {...marker} />)} */}

          {circleProps.visible ? <Circle  {...circleProps} /> : null}
        </MapView>
      </View>

      <InfoPane ref={infoPaneRef} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map_container: {
    ...StyleSheet.absoluteFillObject,
    height: '90%',
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


