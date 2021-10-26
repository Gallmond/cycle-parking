import { geohashQueryBounds } from 'geofire-common'

import staticEnums from './cycleparking_enums.json'

class CyclePark{
  constructor( formatted_object ){
    this.data = formatted_object
  }
  setDistance = ( distance )=>{
    this.data['distance'] = distance;
    return this;
  }
  getDistance = () => {
    return this.data['distance'] ?? null;
  }
  getId = () => {
    return this.data['id'] ?? null;
  }
  getGeohash = () => {
    return this.data['geohash'] ?? null;
  }
  getLat = () => {
    return this.data['lat'] ?? null;
  }
  getLon = () => {
    return this.data['lon'] ?? null;
  }
  getName = () => {
    return CycleParking.getEnum('names', this.data['name'].toString() ); 
  }
  getSpaces = () => {
    return this.data['spaces'] ?? null;
  }
  getType = () => {
    return CycleParking.getEnum('types', this.data['type'].toString() ); 
  }
  getPicurl1 = () => {
    const formattedHost = this.replaceOrigin( this.data['picurl1'] )
    return formattedHost;
  }
  getPicurl2 = () => {
    const formattedHost = this.replaceOrigin( this.data['picurl2'] )
    return formattedHost;
  }
  isHanger = () => {
    return this.data['hanger'] ?? null;
  }
  isTiered = () => {
    return this.data['tiered'] ?? null;
  }
  isLocker = () => {
    return this.data['locker'] ?? null;
  }
  isSecure = () => {
    return this.data['secure'] ?? null;
  }
  isCovered = () => {
    return this.data['covered'] ?? null;
  }

  /**
   * replace the origin part of the origin id with the full one
   *
   * @memberof CyclePark
   */
  replaceOrigin = ( url ) => {
    let id = url.match(/#(\d+)/) // "pic1url": "#0/coolimg_123456.png"
    let host
    if(id && id[1]){
      host = CycleParking.getEnum('imghosts', id[1].toString()) 
    }else{
      throw new Error(`could not get host id from ${str}`)
    }
    return url.replace(id[0], host)
  }

}


class CycleParking{

  static staticEnums = staticEnums

  constructor( debug = false ){
    this.debug = debug

    /**
     * the actual place data object
     */
    this.data = {}

    /**
     * ids go here
     * 
     * names
     * types
     * imghosts
     */
    this.enums = {}

  }

  /**
   * 
   * @returns {object}
   */
  getData = () => {
    return this.data;
  }

  /**
   * set data
   * @param {object} data 
   * @returns {this}
   */
  setData = ( data ) => {
    this.data = data
    return this
  }

  /**
   * 
   */
  setEnums = ( enumsData ) => {
    this.enums = enumsData
    return this
  }

  /**
   *
   *
   * @memberof CycleParking
   */
  static getEnum = ( key, id ) => {
    let value = null
    if( 
      this.staticEnums[ key.toString() ]
      && this.staticEnums[ key.toString() ][ id.toString() ]
    ){
      value = this.staticEnums[ key.toString() ][ id.toString() ]
    }
    return value
  }


  /**
   * returns with an array of CyclePark
   *
   * @memberof CycleParking
   */
  getCycleParksById = ( place_ids ) => {
    return new Promise((resolve,reject)=>{
      const found_cycleParks = []
      for(const geohash in this.getData()){
        for(var i = 0, l = this.getData()[ geohash ].length; i < l; i++){
          var place = this.getData()[ geohash ][i];
          if(place_ids.indexOf( place['id'] ) !== -1){
            found_cycleParks.push( new CyclePark( place ) )
          }
        }
      }
      resolve( found_cycleParks )
    });
  }
  /**
   * With the new format this has to loop through the entire array so return a promise instead
   * @param {string} place_id 
   * @returns 
   */
  getCycleParkById = ( place_id ) => {
    return new Promise((resolve,reject)=>{
      for(const geohash in this.getData()){
        for(var i = 0, l = this.getData()[ geohash ].length; i < l; i++){
          var place = this.getData()[ geohash ][i];
          if(place['id'] === place_id){
            resolve( new CyclePark( place ) )
          }
        }
      }
      reject(`no place with id ${place_id}`)
    });
  } 

  /**
   * This has to search the entire dataset, so return a promise
   * @param {number} lat latitude
   * @param {number} lon longitude
   * @param {number} radius_in_metres search area
   * @returns 
   */
  getCycleParksInRange = ( lat, lon, radius_in_metres ) => {
    return new Promise((resolve,reject)=>{
      
      const places = []

      // get the start/end bounds that this circle overlaps
      // this is from 'geofire-common', you can see it here: https://cdn.jsdelivr.net/npm/geofire-common@5.2.0/dist/geofire-common/index.js
      const bounds = geohashQueryBounds([lat, lon], radius_in_metres);

      // for each of these bounds
      for (let i = 0, l = bounds.length; i < l; i++) {
        const [start, end] = bounds[i];

        // for every geohash in our data
        for(let geohash in this.getData()){

          // if the first seven chars match, check that the places it contains fall between
          // the start and end
          if(
            geohash > start
            && geohash < end
          ){

            // for each of these places, check the _actual_ point distance
            // geohashes are square 'blocks' so if the circle overlaps the corner
            // of a block it might be included despite being out of range of the circle

            const places_in_block = this.getData()[ geohash ]
            for (let ii = 0, ll = places_in_block.length; ii < ll; ii++) {
            const place = places_in_block[ ii ]
              const dist_from_centre = this.getDistBetweenTwoPoints([lat, lon] , [place.lat, place.lon])
              
              // skip it if we're outside of the circle
              if(dist_from_centre > radius_in_metres) continue

              // create object and set distance from search centre
              const cyclePark = new CyclePark(place).setDistance( dist_from_centre );

              // collect it
              places.push( cyclePark )
            }
            

          }
        }
      }

      resolve(places)

    })
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

export { CycleParking, CyclePark }