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

import MapView, { Circle, Marker } from "react-native-maps";

import { CycleParking } from "./cycleparking-tools/CycleParking";
const cycleParking = new CycleParking( true );

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const mapRef = useRef(null);

  const barnes_roundabout_latlon = [51.470624, -0.255804];

  const latitudeDeltaToMetres = ( latitudeDelta ) => {
    // 0.00001° = 1.11 m
    // 1degree is approx 69 miles
    const miles = latitudeDelta * 69
    const metres = miles / 0.00062137
    return metres
  }

  const [markers, setMarkers] = useState([])

  // circle props
  const [circleProps, setCircleProps] = useState({
    visible: false,
    center:{latitude:barnes_roundabout_latlon[0], longitude: barnes_roundabout_latlon[1]},
    radius:100
  })

  // keep track of the region, we need the deltas
  const [mapRegion, setRegion] = useState(null)
  const onRegionChangeCompleteHandler = (e) => {
    console.log('onRegionChangeCompleteHandler e', e)
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

  const onPressHandler = async (e) => {
    console.log('onPressHandler e.nativeEvent', e.nativeEvent)
    // {"action": "press", "coordinate": {"latitude": 51.4741348880686, "longitude": -0.25690030306577677}, "position": {"x": 435, "y": 781}}

    const tapped_lat = e.nativeEvent.coordinate.latitude
    const tapped_lon = e.nativeEvent.coordinate.longitude

    // draw circle
    const radius = drawCircleToFitWidth(tapped_lat, tapped_lon)

    // get cycle parking
    cycleParking.getCycleParksInRange( tapped_lat, tapped_lon, radius ).then( places => {
      console.log(`getCycleParksInRange got ${places.length} places`, places)

      const new_markers = []
      let i = 0
      places.forEach( place => {
        i++
        new_markers.push({
          key: String(i),
          coordinate: {
            latitude: place.lat,
            longitude: place.lon
          }
        })
      })

      setMarkers( new_markers )

    }).catch(console.log)
    

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
    const new_radius = Math.min(latitudeDeltaToMetres(latitudeDelta) / 5, 400);
    setCircleProps(prevState => {
      const newState = {
        ...prevState,
        visible: true,
        center: new_centre,
        radius: new_radius,
      };
      console.log('new circle state', newState);
      return newState;
    });
    return new_radius
  };


  const getCurrentCameraPosition = () => {
    return mapRef.current.getCamera();
  }


  return (
    <View  style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        camera={mapCamera}
        onPress={onPressHandler}
        onRegionChangeComplete={onRegionChangeCompleteHandler}
        // initialRegion={{
        //   latitude: 37.78825,
        //   longitude: -122.4324,
        //   latitudeDelta: 0.0922,
        //   longitudeDelta: 0.0421,
        // }}
      >
        {markers.map( marker => <Marker key={marker.key} coordinate={marker.coordinate} /> )}

        {circleProps.visible ? <Circle center={circleProps.center} radius={circleProps.radius} /> : null}

      </MapView>
      
    </View>

    // <SafeAreaView style={backgroundStyle}>
    //   <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
    //   <ScrollView
    //     contentInsetAdjustmentBehavior="automatic"
    //     style={backgroundStyle}>
    //     <Header />
    //     <View
    //       style={{
    //         backgroundColor: isDarkMode ? Colors.black : Colors.white,
    //       }}>
    //       <Section title="Step One">
    //         Edit <Text style={styles.highlight}>App.js</Text> to change this
    //         screen and then come back to see your edits.
    //       </Section>
    //       <Section title="See Your Changes">
    //         <ReloadInstructions />
    //       </Section>
    //       <Section title="Debug">
    //         <DebugInstructions />
    //       </Section>
    //       <Section title="Learn More">
    //         Read the docs to discover what to do next:
    //       </Section>
    //       <LearnMoreLinks />
    //     </View>
    //   </ScrollView>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  highlight: {
    fontSize: 14,
    color: 'white'
  }
 });

export default App;
