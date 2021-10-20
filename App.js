/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {useState, useRef, useEffect} from 'react';
import {
  Image,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import MapView from 'react-native-map-clustering';
import {Callout, Circle, Marker} from 'react-native-maps';

import {CycleParking} from './cycleparking-tools/CycleParking';
import InfoPane from './Components/InfoPane/InfoPane.js';
import CycleParkingInformationPage from './CycleParkingInformationPage';

import cycleparkingJson from './cycleparking-tools/cycleparking.json';
import cycleparkingEnumJson from './cycleparking-tools/cycleparking_enums.json';
import userSettings from './UserSettings';
import SettingsPage from './Components/GavMaterial/SettingsPage/SettingsPage'

import themes from './Theme';
import BottomBar from './Components/GavMaterial/BottomBar/BottomBar';

import ListView from './Components/GavMaterial/ListView/ListView';
import InformationBar from './Components/GavMaterial/InformationBar/InformationBar';

const cycleParking = new CycleParking(true);
cycleParking.setData(cycleparkingJson).setEnums(cycleparkingEnumJson);

// unchanging settings
const WIN_WIDTH = Dimensions.get('window').width;
const BARNES_ROUNDABOUT_LATLON = [51.470624, -0.255804];
const MAX_CIRCLE_RADIUS_METRES = 1000;

// https://mapstyle.withgoogle.com/
const GOOGLE_MAP_STYLE = [
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

// helper functions
const latitudeDeltaToMetres = latitudeDelta => {
  const miles = latitudeDelta * 69; // 1 degree is approx 69 miles
  const metres = miles / 0.00062137; // 0.00001° = 1.11 m
  return metres;
};

const App = () => {
  // reference to the map, use this to call map methods
  const mapRef = useRef(null);
  const tappedMarkerRef = useRef(null);

  // all markers
  const [searchedMarkers, setSearchedMarkers] = useState([]);
  const [bookmarkedMarkers, setBookmarkedMarkers] = useState([]);
  const [bookmarkedCycleParkIds, setBookmarkedCycleParkIds] = useState([]);

  const [imageOverlay, setImageOverlay] = useState({
    visible: false,
    sources: [],
  });

  // the floating text on initial load
  const [floatingTextVisible, setFloatingTextVisible] = useState(true);

  // load bookmarks only once
  useEffect(() => {
    updateDrawableBookmarks();
  }, []); // the array indicates when this should re-run (ie, no states changing so don't re-run)

  const updateDrawableBookmarks = () => {
    userSettings.get('bookmarks').then(cycleParkIds => {
      setBookmarkedCycleParkIds(cycleParkIds);

      const temp_searchedMarkers = [...searchedMarkers];
      for (let i = temp_searchedMarkers.length - 1; i >= 0; i--) {
        if (
          cycleParkIds.indexOf(temp_searchedMarkers[i].cyclepark.getId()) !== -1
        ) {
          temp_searchedMarkers.splice(i, 1);
        }
      }
      setSearchedMarkers(temp_searchedMarkers);

      cycleParking
        .getCycleParksById(cycleParkIds)
        .then(putBookmarkMarkersOnMap)
        .catch(console.log);
    });
  };

  // store the currently selected marker here
  const [selectedMarker, setSelectedMarker] = useState(null);

  // keep track of the region, we use this for latitudeDelta and calculating circle width
  const [mapRegion, setRegion] = useState(null);

  // display the info pane
  const [displayInfo, setDisplayInfo] = useState(false);

  // display the settings page
  const [settingsPageVisible, setSettingsPageVisible] = useState(false);

  // display the list view
  const [listViewVisible, setListViewVisible] = useState(false);

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
    center: {
      latitude: BARNES_ROUNDABOUT_LATLON[0],
      longitude: BARNES_ROUNDABOUT_LATLON[1],
    },
    radius: 100,
  });

  // some formatting to return marker
  const renderMarker = (marker, highlight_pin = false) => {
    const markerprops = {...marker, pinColor: highlight_pin ? 'blue' : 'red'};
    return (
      <Marker
        onPress={(comp, e) => {
          onMarkerPress(comp, marker);
        }}
        {...markerprops}>
        <Callout title={marker.title} description={marker.description} />
      </Marker>
    );
  };

  // When the region changes, update our copy of it
  const onRegionChangeCompleteHandler = e => {
    setRegion(e);
  };

  // pan the camera to a given lat lon over a given time
  const setCameraOver = (lat, lon, duration_ms = 500, new_zoom = null) => {
    const newCameraConfig = {
      center: {
        latitude: lat,
        longitude: lon,
      },
    };

    if (new_zoom) {
      newCameraConfig['zoom'] = new_zoom;
    }

    mapRef.current.animateCamera(newCameraConfig, {duration: duration_ms});
  };

  const searchMap = async (lat, lon) => {
    console.log('searchMap(lat, lon)', lat, lon);

    setFloatingTextVisible(false);

    const tapped_lat = lat;
    const tapped_lon = lon;

    // draw circle
    const radius = drawCircleToFitWidth(tapped_lat, tapped_lon);

    console.log(`map tapped ${tapped_lat}, ${tapped_lon} radius: ${radius}`);

    // get cycle parking and add it to the map
    cycleParking
      .getCycleParksInRange(tapped_lat, tapped_lon, radius)
      .then(putCycleParkMarkersOnMap)
      .catch(console.log);

    // put bookmarked markers on
    cycleParking
      .getCycleParksById(bookmarkedCycleParkIds)
      .then(putBookmarkMarkersOnMap)
      .catch(console.log);

    // centre camera here
    setCameraOver(tapped_lat, tapped_lon, 500);

    // clear the selectedMarker if any is set
    selectedMarker && setSelectedMarker(null);
  };

  // when the map itself is pressed
  const onPressHandler = async e => {
    const tapped_lat = e.nativeEvent.coordinate.latitude;
    const tapped_lon = e.nativeEvent.coordinate.longitude;

    searchMap(tapped_lat, tapped_lon);
  };

  const formatMarkerFromCyclePark = cyclepark_object => {
    return {
      id: cyclepark_object.getId(), // for the react id
      key: cyclepark_object.getId(), // for the react key
      coordinate: {
        latitude: cyclepark_object.getLat(),
        longitude: cyclepark_object.getLon(),
      },
      cyclepark: cyclepark_object,
      // callout options, remove to disable
      // title: cyclepark_object.getName(),
      // description: `${cyclepark_object.getType()} (${cyclepark_object.getSpaces()} spaces) (${!cyclepark_object.isSecure() ? 'not ' : ''}secure)`
    };
  };

  // create markers for a given set of CyclePark objects
  const putBookmarkMarkersOnMap = cycleparks => {
    const new_markers = [];
    cycleparks.forEach(cyclepark => {
      new_markers.push(formatMarkerFromCyclePark(cyclepark));
    });
    setBookmarkedMarkers(new_markers);
  };

  // create markers for a given set of CyclePark objects
  const putCycleParkMarkersOnMap = (cycleparks, are_bookmarks = false) => {
    const new_markers = [];
    cycleparks.forEach(cyclepark => {
      // skip any that exist in the bookmarks
      if (bookmarkedCycleParkIds.includes(cyclepark.getId())) return;
      new_markers.push(formatMarkerFromCyclePark(cyclepark));
    });
    setSearchedMarkers(new_markers);
  };

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
    const new_radius = Math.min(
      latitudeDeltaToMetres(latitudeDelta) / 3,
      MAX_CIRCLE_RADIUS_METRES,
    );
    setCircleProps(prevState => {
      const newState = {
        ...prevState,
        visible: true,
        center: new_centre,
        radius: new_radius,
      };
      return newState;
    });
    return new_radius;
  };

  const toggleInfoPane = e => {
    setDisplayInfo(!displayInfo);
  };

  const onMarkerPress = (comp, e) => {
    setSelectedMarker(e);
    setFloatingTextVisible(false);
  };

  const toggleSettingsPage = () => {
    console.log('toggleSettingsPage()');
    closeAllViews();
    setSettingsPageVisible(!settingsPageVisible);
  };

  const toggleListView = () => {
    console.log('Toggle List View!!!');
    closeAllViews();
    setListViewVisible(!listViewVisible);
  };

  const searchAtCurrentCameraPosition = async () => {
    console.log('searchAtCurrentCameraPosition()');
    const currentCamera = await mapRef.current.getCamera();
    const lat = currentCamera.center.latitude;
    const lon = currentCamera.center.longitude;
    searchMap(lat, lon);
  };

  /**
   * set all views not visible
   */
  const closeAllViews = () => {
    console.log('closeAllViews()');
    setSettingsPageVisible(false);
    setListViewVisible(false);
  };

  return (
    <View style={styles.container}>

      {/* draw the images overlay if it is visible */}
      {imageOverlay.visible && (
        <TouchableOpacity
          onPress={() => {
            setImageOverlay({...imageOverlay, visible: false});
          }}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: themes.main.background,
            flexDirection: 'column',
          }}>
          {imageOverlay.sources.map(src => {
            return (
              <Image
                style={{
                  width: undefined,
                  height: undefined,
                  flex: 1,
                  resizeMode: 'contain',
                }}
                key={src}
                source={{uri: src}}
              />
            );
          })}

          <Text
            style={{
              textAlignVertical: 'center',
              position: 'absolute',
              color: themes.main.text.onPrimary,
              fontSize: 35,
            }}>
            Tap anywhere to close
          </Text>
        </TouchableOpacity>
      )}

      {/* MAP CONTAINER START */}
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
          clusterColor={'#EA3535'}
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

        {selectedMarker && (
          //TODO selecting new markers does not rerender 
          <InformationBar 
            selectedMarker={selectedMarker}
            onShowPhotos={(imagesArray)=>{
              setImageOverlay({
                // imagesArray is an array of urls to images
                visible: !imageOverlay.visible,
                sources: imagesArray,
              });
            }}
          />
        )}

        {/* The top section with the bits of info for the selected cyclepark */}
        {false && selectedMarker && (
          <InfoPane
            marker={selectedMarker}
            onShowInfoPane={toggleInfoPane}
            onBookmarksChanged={updateDrawableBookmarks}
            onShowImageOverlay={imagesArray => {
              // imagesArray is an array of urls to images
              setImageOverlay({
                visible: !imageOverlay.visible,
                sources: imagesArray,
              });
            }}
          />
        )}

        {floatingTextVisible && (
          <Text
            style={{
              position: 'absolute',
              top: '30%',
              fontSize: 40,
              textAlign: 'center',
            }}>
            Tap to search{'\n'}Pinch & drag to move
          </Text>
        )}

        {displayInfo && selectedMarker && (
          <CycleParkingInformationPage
            style={{...StyleSheet.absoluteFillObject}}
            cyclePark={selectedMarker.cyclepark}
            onBookmarksChanged={updateDrawableBookmarks}
          />
        )}

        {listViewVisible && (
          <ListView
            searchedMarkers={searchedMarkers}
            bookmarkedMarkers={bookmarkedMarkers}
            optionSelected={markerObject => {
              // move camera here
              const lat = markerObject.coordinate.latitude;
              const lon = markerObject.coordinate.longitude;
              setCameraOver(lat, lon, 500, 19);
              setSelectedMarker(markerObject);
              setFloatingTextVisible(false);
              setListViewVisible(false);
            }}
          />
        )}
      </View>
      {/* MAP CONTAINER END  */}

      {/* settings page (clear bookmarks, always show image) */}
      {settingsPageVisible && (
        <SettingsPage onBookmarksChanged={updateDrawableBookmarks} />
      )}

      {/* The bottom bar of the app.  */}
      {/* Contains menu button, settings button, and FAB(s) */}
      <BottomBar
        onSettingsButtonPress={toggleSettingsPage}
        onListViewButtonPress={toggleListView}
        onSearchButtonPress={searchAtCurrentCameraPosition}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  instructionsPage: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'green',
  },
  instructionsButton: {
    width: '10%',
    aspectRatio: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'white',
  },
  instructionsButtonImage: {
    resizeMode: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map_container: {
    // ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    flex: 9,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  highlight: {
    fontSize: 14,
    color: 'white',
  },
  mapCluster: {
    width: 22,
    height: 22,
    borderRadius: 22 / 2,
    backgroundColor: 'red',
  },
  mapClusterText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center', // <-- the magic
  },
});

export default App;
