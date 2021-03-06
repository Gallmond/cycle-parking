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
  Dimensions,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from 'react-native';

// react native map parts
import MapView from 'react-native-map-clustering';
import {Callout, Circle, Marker} from 'react-native-maps';

// interact with cycle parking data
import {CycleParking} from './cycleparking-tools/CycleParking';
import cycleparkingJson from './cycleparking-tools/cycleparking.json';
import cycleparkingEnumJson from './cycleparking-tools/cycleparking_enums.json';

// user settings helper
import userSettings from './UserSettings';

// components
import SettingsPage from './Components/GavMaterial/SettingsPage/SettingsPage';
import BottomBar from './Components/GavMaterial/BottomBar/BottomBar';
import ListView from './Components/GavMaterial/ListView/ListView';
import InformationBar from './Components/GavMaterial/InformationBar/InformationBar';
import ImagePopup from './Components/GavMaterial/ImagePopup/ImagePopup';
import FloatingButtons from './Components/GavMaterial/FloatingButtons/FloatingButtons';
import FocusOnMeButton from './Components/GavMaterial/Misc/FocusOnMeButton';

// device functions
import {getCurrentDeviceLocation} from './Utils/DeviceFunctions';

// maths
import {latitudeDeltaToMetres} from './Utils/Maths';

// init cycle parking data
const cycleParking = new CycleParking(true);
cycleParking.setData(cycleparkingJson).setEnums(cycleparkingEnumJson);

// unchanging settings
const WIN_WIDTH = Dimensions.get('window').width;
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

const App = () => {
  // reference to the map, use this to call map methods
  const mapRef = useRef(null);

  /**
   * Keep track of user intention separate from device permission. If user has
   * said no, don't keep asking. Ask once here at the start
   */
  const [currentDeviceLocation, setCurrentDeviceLocation] = useState(null);
  const [defaultLocation, setDefaultLocation] = useState({
    // london bridge
    lat: 51.5079,
    lon: -0.0877,
  });

  // set first time
  useEffect(() => {
    userSettings.get('canAccessDeviceLocation').then(val => {
      // if we don't have it from settings, request it one more time
      if (val !== true) {
        requestDeviceLocationPermission().then(canAccess => {
          userSettings.set('canAccessDeviceLocation', canAccess);
        });
      } else {
        getCurrentDeviceLocation().then(position => {
          const thisPosition = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          };
          setCurrentDeviceLocation(thisPosition);
          setDefaultLocation(thisPosition);
        });
      }
    });
  }, []);

  // set map if default location changes
  useEffect(() => {
    setCameraOver(defaultLocation.lat, defaultLocation.lon, 500);
  }, [defaultLocation]);

  // all markers
  const [searchedCycleParkIds, setSearchedCycleParkIds] = useState([]);
  const [searchedMarkers, setSearchedMarkers] = useState([]);
  const [bookmarkedCycleParkIds, setBookmarkedCycleParkIds] = useState([]);
  const [bookmarkedMarkers, setBookmarkedMarkers] = useState([]);

  // the floating text on initial load
  const [floatingTextVisible, setFloatingTextVisible] = useState(true);

  // the cycle parking image view
  const [imageOverlay, setImageOverlay] = useState({
    visible: false,
    sources: [],
  });

  // load bookmarks only once
  useEffect(() => {
    updateDrawableBookmarks();
  }, []); // the array indicates when this should re-run (ie, no states changing so don't re-run)

  // when searchedCycleParkIds is updated, re-render the pins
  useEffect(() => {
    cycleParking
      .getCycleParksById(searchedCycleParkIds)
      .then(putCycleParkMarkersOnMap)
      .catch(console.error);
  }, [searchedCycleParkIds]);

  // when bookmarkedCycleParkIds is updated, re-render the pins
  useEffect(() => {
    cycleParking
      .getCycleParksById(bookmarkedCycleParkIds)
      .then(putBookmarkMarkersOnMap)
      .catch(console.error);
  }, [bookmarkedCycleParkIds]);

  // if a component in the tree has changed the bookmarks, this function should be called
  const updateDrawableBookmarks = () => {
    userSettings.get('bookmarks').then(cycleParkIds => {
      // set of bookmarks before the remote update
      const oldBookmarkIds = bookmarkedCycleParkIds;

      // the new set of bookmarks
      const newBookmarkIds = cycleParkIds;

      // which of the old ones are no longer present in the new ones?
      const removedBookmarkIds = oldBookmarkIds.filter(
        x => !newBookmarkIds.includes(x),
      );

      // get the IDs of the search results currently on screen
      // (not including those that exists in new bookmarks list)
      const oldSearchResultIds = searchedMarkers.reduce((prev, current) => {
        const thisSearchResultId = current.cyclepark.getId();
        // omit search results in the new bookmars1
        if (!newBookmarkIds.includes(thisSearchResultId)) {
          prev.push(thisSearchResultId);
        }
        return prev;
      }, []);

      // set the new bookmarked ids, useEffect will rerender
      setBookmarkedCycleParkIds(newBookmarkIds);

      // set the new search result ids (the old ones plus any removed bookmars)
      // useEffect will rerender
      setSearchedCycleParkIds([...oldSearchResultIds, ...removedBookmarkIds]);
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
      latitude: defaultLocation.lat,
      longitude: defaultLocation.lon,
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
      latitude: defaultLocation.lat,
      longitude: defaultLocation.lon,
    },
    radius: 100,
  });

  // some formatting to return marker
  const renderMarker = (marker, highlight_pin = false) => {
    const markerProps = {...marker, pinColor: highlight_pin ? 'blue' : 'red'};
    return (
      <Marker
        onPress={(comp, e) => {
          onMarkerPress(comp, marker);
        }}
        {...markerProps}>
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
    setFloatingTextVisible(false);

    // update stored device position (it is used for distance measuring)
    getCurrentDeviceLocation().then(pos => {
      if (pos) {
        setCurrentDeviceLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      }
    });

    const tapped_lat = lat;
    const tapped_lon = lon;

    // draw circle
    const radius = drawCircleToFitWidth(tapped_lat, tapped_lon);

    // search cycleParking and collect the ids
    cycleParking
      .getCycleParksInRange(tapped_lat, tapped_lon, radius)
      .then(cycleParkObjects => {
        const ids = cycleParkObjects.reduce((prev, current) => {
          prev.push(current.getId());
          return prev;
        }, []);
        setSearchedCycleParkIds(ids);
      })
      .catch(console.error);

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
      // only add ones not already in bookmarks
      if (!bookmarkedCycleParkIds.includes(cyclepark.getId())) {
        new_markers.push(formatMarkerFromCyclePark(cyclepark));
      }
    });
    setSearchedMarkers(new_markers);
  };

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

  const onMarkerPress = (comp, e) => {
    setSelectedMarker(e);
    setFloatingTextVisible(false);
  };

  const toggleSettingsPage = () => {
    closeAllViews();
    setSettingsPageVisible(!settingsPageVisible);
  };

  const toggleListView = () => {
    closeAllViews();
    setListViewVisible(!listViewVisible);
  };

  const searchAtCurrentCameraPosition = async () => {
    const currentCamera = await mapRef.current.getCamera();
    const lat = currentCamera.center.latitude;
    const lon = currentCamera.center.longitude;
    searchMap(lat, lon);
  };

  /**
   * set all views not visible
   */
  const closeAllViews = () => {
    setSettingsPageVisible(false);
    setListViewVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
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
          {searchedMarkers.map(marker => renderMarker(marker))}
          {bookmarkedMarkers.map(marker => renderMarker(marker, true))}

          {/* Draw the circle if it's visible */}
          {circleProps.visible && <Circle {...circleProps} />}
        </MapView>

        {/* focus on me button */}
        <FocusOnMeButton
          onPress={()=>{
            getCurrentDeviceLocation()
              .then(position => {
                const thisPosition = {
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                };
                setCurrentDeviceLocation(thisPosition);
                setCameraOver(thisPosition.lat, thisPosition.lon, 500);
              })
              .catch(console.error);
          }}
        />
        

        {/* bar along the top with the space info */}
        {selectedMarker && (
          <InformationBar
            selectedMarker={selectedMarker}
            onShowPhotos={imagesArray => {
              setImageOverlay({
                // imagesArray is an array of urls to images
                visible: !imageOverlay.visible,
                sources: imagesArray,
              });
            }}
          />
        )}

        {/* the nav and bookmark buttons */}
        {selectedMarker && (
          <FloatingButtons
            selectedMarker={selectedMarker}
            isCurrentBookmark={bookmarkedCycleParkIds.indexOf(selectedMarker.cyclepark.getId()) !== -1}
            onBookmarksChanged={() => {
              updateDrawableBookmarks();
              setListViewVisible(false);
            }}
          />
        )}

        {/* fill the screen with the photos overlay if visible */}
        {imageOverlay.visible && (
          <ImagePopup
            onPress={() => {
              setImageOverlay({...imageOverlay, visible: false});
            }}
            imageOverlay={imageOverlay}
          />
        )}

        {/* instruction text */}
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

        {/* side list view */}
        {listViewVisible && (
          <ListView
            currentDeviceLocation={currentDeviceLocation}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map_container: {
    width: '100%',
    height: '100%',
    flex: 9,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default App;
