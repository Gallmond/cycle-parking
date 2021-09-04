// import * as fs from 'fs'
// import * as FileSystem from 'expo-file-system';
// var RNFS = require('react-native-fs');
import {encode, decode, bounds, adjacent, neighbours} from './GeohashingVeness.js'
import { geohashQueryBounds } from 'geofire-common'
import bigJSON from './cycleparking.json'
import newJSON from './cycleparking_format_test.json'

class CycleParking{

  constructor( debug = false ){
    this.debug = debug

    /**
     * file holding the data, use this if setData is not used
     */
    this.default_data_file = `./cycleparking.json`

    /**
     * the actual place data object
     */
    this.data = {}
    this.data = bigJSON
    this.data_new = newJSON
    this.geohashes_created = false

    /**
     * store of geohash keys keys
     */
    this.geohash_reference = {}

    // init with default data. The geohash references are not built until this is done
    this.getData()
    // this.addGeohashesToData()

  }

  /**
   * set this.cyclepark_data
   * @param {object} cyclepark_data 
   * @returns 
   */
  setData = ( cyclepark_data ) => {
    this.data = cyclepark_data
    if(!this.geohashes_created){
      this.addGeohashesToData()
      this.geohashes_created = true  
    }
    return this
  }


  // getter
  getData = () => {
    const keys = Object.keys(this.data)
    // if(this.debug) console.log(`getData(): this.data has ${keys.length} keys`)
    // if(this.debug) console.log(`getData(): first key: ${keys[0]} last key: ${keys[keys.length-1]}`)
    // if(this.debug) console.log(`getData(): this.data[ ${keys[0]} ]: ${JSON.stringify(this.data[ keys[0] ])}`)
    if(Object.keys(this.data).length === 0){
      // const file_content = FileSystem.readAsStringAsync( this.default_data_file, {encoding: 'utf8'} )
      // // const file_content = fs.readFileSync( this.default_data_file, {encoding:'utf-8'} )
      // const file_object = JSON.parse( file_content )
      // if(!file_object) throw new Error(`Could not read content of default_data_file ${this.default_data_file}`)
      // this.setData( file_object )
    }
    return this.data;
  }


  /**
   * get the object of one place
   * @param {string} place_id 
   * @returns {object|undefined} the place json for one place (or undefined)
   */
  getCycleParkById = ( place_id ) => {
    this.getData()[ place_id ]
  } 

  getCycleParksInRange = ( lat, lon, radius_in_metres ) => {
    return new Promise((resolve,reject)=>{
      
      const places = []

      // get the start/end bounds that this circle overlaps
      // this is from 'geofire-common', you can see it here: https://cdn.jsdelivr.net/npm/geofire-common@5.2.0/dist/geofire-common/index.js
      const bounds = geohashQueryBounds([lat, lon], radius_in_metres);

      // for each of these bounds
      for (let i = 0, l = bounds.length; i < l; i++) {
        const [start, end] = bounds[i];

        // get the first 7 chars, it's approx 150sq metres
        const start_7 = start.substr(0,7) // ≤ 153m 	× 	153m
        
        // for every geohash in our data
        for(let geohash in this.data_new){

          // if the first seven chars match, check that the places it contains fall between
          // the start and end
          if(
            geohash > start
            && geohash < end
          ){

            // for each of these places, check the _actual_ point distance
            // geohashes are square 'blocks' so if the circle overlaps the corner
            // of a block it might be included despite being out of range of the circle

            const places_in_block = this.data_new[ geohash ]
            for (let ii = 0, ll = places_in_block.length; ii < ll; ii++) {
              const place = places_in_block[ ii ]
              const dist_from_centre = this.getDistBetweenTwoPoints([lat, lon] , [place.lat, place.lon])
              
              // skip it if we're outside of the circle
              if(dist_from_centre > radius_in_metres) continue

              // otherwise collect it!
              places.push(place)
            }
            

          }
        }
      }

      // come to think of it nothing in this function is synchronous any more so can probs remove promises
      resolve(places)

    })
  }

  /**
   * resolves with an array of places
   * @param {number} lat 
   * @param {number} lon 
   * @param {number} radius_in_metres 
   * @returns {Promise} 
   */
   Z_getCycleParksInRange = ( lat, lon, radius_in_metres ) => {
    return new Promise((resolve,reject)=>{
      
      const places = []

      // get bounds 
      const bounds = geohashQueryBounds([lat, lon], radius_in_metres);
      console.log('bounds', bounds);
      // const bounds = geofire.geohashQueryBounds([lat, lon], radius_in_metres);

      // get keys from the reference in this bound
      const all_keys = []
      for (let i = 0, l = bounds.length; i < l; i++) {
        const [start, end] = bounds[i];
        all_keys.push( ...this.getPlaceKeysInGeohashBounds( start, end ) ) 
      }

      // collect places
      for(let i=0, l=all_keys.length; i<l; i++){
        let place_id = all_keys[i];
        let this_place = this.getCycleParkById( place_id )

        // if for whatever reason this key does not return a place
        if(!this_place) continue

        // skip this place if it's not within radius_in_metres of the search point
        const dist_from_centre = this.getDistBetweenTwoPoints([lat, lon] , [this_place.lat, this_place.lon])
        if(dist_from_centre > radius_in_metres) continue

        // add the key as the id, it's not stored in the data object
        this_place['id'] = place_id
        this_place['dist'] = dist_from_centre.toFixed(1)

        // add it to the array
        places.push( this_place )
      }

      resolve(places) 
    })
  }


  /**
   * return array of keys that are found in the geohash_reference between given bounds
   * @param {string} start 
   * @param {string} end 
   * @returns 
   */
  getPlaceKeysInGeohashBounds = (start, end) => {
    const start_4 = start.substr(0, 4)

    const found_keys = []

    for (const place_id in this.getData()) {
      if(this.getData().hasOwnProperty( place_id )){
        const this_place = this.getData()[ place_id ]
        
        const lat = this.getData()[ place_id ]['lat']
        const lon = this.getData()[ place_id ]['lon']
        let geoHash

        if(!this_place.geohash){
          geoHash = encode( lat, lon, 9 )
          this.getData()[ place_id ]['geohash'] = geoHash
        }else{
          geoHash = this.getData()[ place_id ]['geohash']
        }

        if(geoHash.indexOf( start_4 ) != 0){
          continue
        }

        console.log(`start: ${start} end: ${end} geohash: ${geoHash}`)

        if(
          geoHash >= start
          && geoHash <= end
        ){
          found_keys.push( place_id )
        }

      }
    }

    return found_keys
    
    // const found_keys = []
    // for (const top_level_key in this.geohash_reference) {
    //   if (
    //     top_level_key.indexOf(start_4) === 0
    //   ) {
    //     for (const second_level_key in this.geohash_reference[top_level_key]) {
    //       if(
    //         second_level_key >= start
    //         && second_level_key <= end
    //       ){
    //         found_keys.push( ...this.geohash_reference[top_level_key][second_level_key] )
    //       }
    //     }
    //   }
    // }

    return found_keys
  }


  /**
   * set the 'geohash' property of all the objects in this.data
   * @returns {this}
   */
  addGeohashesToData = () => {
    if(this.debug) console.log('addGeohashesToData(): typeof this.getData()', typeof this.getData());
    if(this.debug) console.log('addGeohashesToData(): JSON.stringify(this.getData()).substring(0,100)', JSON.stringify(this.getData()).substring(0,100));

    const keys = Object.keys( this.getData() )

    if(this.debug) console.log(`addGeohashesToData(): keys.length ${keys.length}`);
    for(let i=0, l=keys.length; i<l; i++){
      let key = keys[i];
      console.log('key', key)
      // // let geohash = encode( this.getData()[ key ].lat, this.getData()[ key ].lon, 9 )
      // let geohash = 'foobar'
      // this.getData()[ key ][ 'geohash' ] =  geohash
      // this.addGeoHashReference( this.getData()[ key ][ 'geohash' ], key )  
    }
    
    // for (const place_id in this.getData()) {
    //   if (this.getData().hasOwnProperty(place_id)) {
    //     // 9 chars is accurate to about 4 metres ish (and is also as accurate as the TFL coords will get)
    //     if(this.debug) console.log('addGeohashesToData(): place_id', place_id);
    //     if(this.debug) console.log('addGeohashesToData(): this.getData()[ place_id ]', this.getData()[ place_id ]);
    //     this.getData()[ place_id ][ 'geohash' ] = encode( this.getData()[ place_id ].lat, this.getData()[ place_id ].lon, 9 ) 
    //     this.addGeoHashReference( this.getData()[ place_id ][ 'geohash' ], place_id )
    //   }
    // }
    this.geohashes_created = true
    return this
  }


   /**
   * Add the given key to the geohash reference
   * @param {string} geohash
   * @param {string} key 
   */
  addGeoHashReference = ( geohash, key )=>{
    let geohash_4 = geohash.substr(0, 4)
    // create object for this level if we don't have it
    if( this.geohash_reference[ geohash_4 ] === undefined ) this.geohash_reference[ geohash_4 ] = {}

    // create array for full hash if we don't have it
    if( this.geohash_reference[ geohash_4 ][ geohash ] === undefined ) this.geohash_reference[ geohash_4 ][ geohash ] = []

    // add to this level if it's not already in there
    if( this.geohash_reference[ geohash_4 ][ geohash ].indexOf( key ) === -1 ){
      this.geohash_reference[ geohash_4 ][ geohash ].push( key ) 
    }
  }


  /**
   * get distance between two points on a sphere https://www.movable-type.co.uk/scripts/latlong.html
   * 
   * @param {array} latlon_1 [latitude , longitude]
   * @param {array} latlon_2 [latitude , longitude]
   * @returns {number} the distance in metres
   */
  getDistBetweenTwoPoints = (latlon_1, latlon_2) => {
    const [lat1, lon1] = latlon_1
    const [lat2, lon2] = latlon_2
    const R = 6371e3 // radius of the earth in metres (give or take)
    const lat1rads = lat1 * Math.PI/180 // φ, λ in radians
    const lat2rads = lat2 * Math.PI/180
    const latdeltarads = (lat2-lat1) * Math.PI/180
    const londeltarads = (lon2-lon1) * Math.PI/180

    const a = Math.sin(latdeltarads/2) * Math.sin(latdeltarads/2) +
              Math.cos(lat1rads) * Math.cos(lat2rads) *
              Math.sin(londeltarads/2) * Math.sin(londeltarads/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c // in metres
  }


}

export { CycleParking }