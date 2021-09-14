import { enableExpoCliLogging } from "expo/build/logs/Logs";
import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Circle } from "react-native-maps";
import { CycleParking } from "./cycleparking-tools/CycleParking";

const cycleParking = new CycleParking();

const barnes_roundabout_latlon = [51.470624, -0.255804];

const latitudeDeltaToMetres = ( latitudeDelta ) => {
  // 0.00001° = 1.11 m
  // 1degree is approx 69 miles
  const miles = latitudeDelta * 69
  const metres = miles / 0.00062137
  return metres
}

const App = () => {
  const mapRef = useRef(null);

  const [circleProps, setCircleProps] = useState({
    center:{latitude:barnes_roundabout_latlon[0], longitude: barnes_roundabout_latlon[1]},
    radius:100
  })

  const [mapRegion, setmapRegion] = useState({
    latitude: barnes_roundabout_latlon[0],
    longitude: barnes_roundabout_latlon[1],
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });

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

  /**
   * user has long pressed
   */
  const onLongPressHandler = async (e) => {
    const lat = e.nativeEvent.coordinate.latitude
    const lon = e.nativeEvent.coordinate.longitude
    const range = 100
    const places = await cycleParking.getCycleParksInRange( lat, lon, range )
  }

  const drawCircleToFitWidth = (latlon, latitudeDelta) => {
    const new_centre = {
      latitude: latlon[0],
      longitude: latlon[1],
    }
    const new_radius = Math.min(latitudeDeltaToMetres( latitudeDelta ) / 5, 400) 
    setCircleProps( prevState => {
      const newState = {
        ...prevState,
        center: new_centre,
        radius: new_radius
      }
      return newState
    })
  }


  /**
   * USER HAS FINISHED DRAGGING THE MAP
   */
  const onRegionChangeCompleteHandler = async (e, event_info) => {
    if (event_info["isGesture"] || true) {
      // only do this if the USER caused this (ie dragged the map)
      const currentCamera = await mapRef.current.getCamera();
      setMapCamera((prevState) => {
        const newState = {
          ...prevState,
          zoom: currentCamera.zoom,
          center: {
            latitude: e.latitude,
            longitude: e.longitude,
          },
        };
        drawCircleToFitWidth( [e.latitude, e.longitude], e.latitudeDelta )
        return newState;
      });
    }
  };

  /**
   * USER TAPS ON MAP
   */
  const onPressHandler = async (e) => {
    const n = e.nativeEvent;
    console.log("onPressHandler", n);
    const currentCamera = await mapRef.current.getCamera();
    setMapCamera((prevState) => {
      const newState = {
        ...prevState,
        zoom: currentCamera.zoom,
        center: {
          latitude: n.coordinate.latitude,
          longitude: n.coordinate.longitude,
        },
      };
      console.log("setting new camera", newState);
      return newState;
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        pitchEnabled={false}
        onPress={onPressHandler}
        onLongPress={onLongPressHandler}
        onRegionChangeComplete={onRegionChangeCompleteHandler}
        style={{ alignSelf: "stretch", height: "100%" }}
        camera={mapCamera}
        // region={mapRegion}
      >
        <Circle center={circleProps.center} radius={circleProps.radius} />
      </MapView>
    </View>
  );
};
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
