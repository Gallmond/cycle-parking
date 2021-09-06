// ============================================================================
// ============================================================================
const TFL_API_DOMAIN = 'api.tfl.gov.uk'
const TFL_APPLICATION_KEY = null
// ============================================================================
// ============================================================================
// ============================================================================





const os = require('os')
const fs = require('fs')
const https = require('https');
const readline = require('readline');
const { formatWithOptions } = require('util');
const { parse } = require('path');

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}




const run = async () => {
  
  const lines = [
    "Download new TFL Export, or provide existing?",
    "\t[1] Download new (might take a while, 67mb or so)",
    "\t[2] Provide existing"
  ]
  const user_answer = await askQuestion(lines.join('\r\n') + '\r\n');

  let tfl_data = ''

  // download new
  if( user_answer.trim() === '1' ){
    
    const save_tfl = await askQuestion('Do you want to save the raw TFL data [Y/N]?' + '\r\n');

    // get the data
    tfl_data = await getAllCycleParksFromTFL();
    console.log(`\tGot data of length ${tfl_data.length}`)

    // save it
    if( save_tfl.toLowerCase() === 'y' ){
        const tfl_export_temp_file = `${os.tmpdir()}/tfl_export.json`
        fs.writeFileSync( tfl_export_temp_file, tfl_data, {encoding:'utf-8'} )
        console.log(`\tWrote file ${tfl_export_temp_file}`)
    }

  }


  // load from existing existing
  if( user_answer.trim() === '2' ){
    
    const file_path = await askQuestion('Please provide full path to tfl export json:' + '\r\n');
    tfl_data = fs.readFileSync( file_path, {encoding:'utf-8'} )
    console.log(`Read data of length ${tfl_data.length}`)
  
  }

  if(tfl_data === ''){
    console.error(`tfl_data is empty`)
    return
  }

  // format
  const places = JSON.parse( tfl_data )
  const formatted = {}

  // **************************************************************************
  // ***************************FORMAT THE OBJECT HERE*************************
  // **************************************************************************
  for(let i = 0, l = places.length; i < l; i++){
    let place = places[i]; 

    const {
      id,                   // id: "CyclePark_RWG014703",
      url,                  // url: "/Place/CyclePark_RWG014703",
      commonName,           // commonName: "Hammersmith & Fulham",
      placeType,            // placeType: "CyclePark",
      additionalProperties, // additionalProperties: [...]
      lat,                  // lat: 51.510321,
      lon,                  // lon: -0.24278
    } = place
    
    const {
      BikeHangar,                // BikeHangar : "TRUE",
      Borough,                   // Borough : "Hammersmith & Fulham",
      Carriageway,               // Carriageway : "FALSE",
      Covered,                   // Covered : "FALSE",
      CycleStandType,            // CycleStandType : "Other",
      Locker,                    // Locker : "FALSE",
      MultiTier,                 // MultiTier : "FALSE",
      NumberOfCycleParkingSpaces,// NumberOfCycleParkingSpaces : "6",
      Photo1Url,                 // Photo1Url : "https://cycleassetimages.data.tfl.gov.uk/RWG014703_1.jpg",
      Photo2Url,                 // Photo2Url : "https://cycleassetimages.data.tfl.gov.uk/RWG014703_2.jpg",
      Provision,                 // Provision : "1",
      Secure,                    // Secure : "FALSE",
    } = additionalPropertiesToObject( place ) 

    // space to int
    let spaces = parseInt( NumberOfCycleParkingSpaces )
    spaces = isNaN(spaces) ? 0 : spaces // if NaN, set to 0

    // secure to 1/0
    let secure = Secure === 'TRUE' ? 1 : 0

    // covered to 1/0
    let covered = Covered === 'TRUE' ? 1 : 0

    // multitier to 1/0
    let tiered = MultiTier === 'TRUE' ? 1 : 0

    // hanger to 1/0
    let hanger = BikeHangar === 'TRUE' ? 1 : 0

    // locker to 1/0
    let locker = Locker === 'TRUE' ? 1 : 0

    const geohash = encode( lat, lon, 9 ) // this is as accurate as the TFL data gets anyway

    if( formatted[ geohash ] === undefined ) formatted[ geohash ] = []

    formatted[ geohash ].push({
      id: id,
      geohash: geohash,
      lat: lat,
      lon: lon,
      spaces:spaces,
      secure:secure,
      covered:covered,
      type: CycleStandType,
      hanger: hanger,
      tiered: tiered,
      locker: locker,
      picurl: Photo1Url
    })

  }
  // **************************************************************************
  // **************************************************************************

  // save
  const formatted_temp_file = `${os.tmpdir()}/cycleparking_formatted.json`
  fs.writeFile( formatted_temp_file, JSON.stringify(formatted), {encoding: 'utf-8'}, (err) => {
    if(err) throw err;
    console.log(`\twrote file ${formatted_temp_file}`)
  })


}

// run it
run();

// this function downloads the entire TFL export, resolves with it in a string
const getAllCycleParksFromTFL = () => {
  return new Promise((resolve,reject)=>{
    const endpoint = `/Place/Type/CyclePark`
    if(TFL_APPLICATION_KEY){
      endpoint+= '?app_key=' + encodeURIComponent(TFL_APPLICATION_KEY)
    }
    const options = {
      hostname: TFL_API_DOMAIN,
      path: endpoint,
      port: 443,
      method: 'GET',
      timeout: 120000
    }
    const req = https.request(options, res => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if(res.statusCode < 200 && res.statusCode > 299){
          reject(req)
        }
        resolve(data);
      });
    })
    req.on('error', () => {
      reject(req)
    })
    req.on('timeout', () => {
      reject(req)
    })
    console.log('\tAttempting to download data')
    req.end() // send it
  });
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Geohash encoding/decoding and associated functions   (c) Chris Veness 2014-2019 / MIT Licence  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

const base32 = "0123456789bcdefghjkmnpqrstuvwxyz"; // (geohash-specific) Base32 map

/**
 * Encodes latitude/longitude to geohash, either to specified precision or to automatically
 * evaluated precision.
 *
 * @param   {number} lat - Latitude in degrees.
 * @param   {number} lon - Longitude in degrees.
 * @param   {number} [precision] - Number of characters in resulting geohash.
 * @returns {string} Geohash of supplied latitude/longitude.
 * @throws  Invalid geohash.
 *
 * @example
 *     const geohash = Geohash.encode(52.205, 0.119, 7); // => 'u120fxw'
 */
const encode = (lat, lon, precision) => {
  // infer precision?
  if (typeof precision == "undefined") {
    // refine geohash until it matches precision of supplied lat/lon
    for (let p = 1; p <= 12; p++) {
      const hash = encode(lat, lon, p);
      const posn = decode(hash);
      if (posn.lat == lat && posn.lon == lon) return hash;
    }
    precision = 12; // set to maximum
  }

  lat = Number(lat);
  lon = Number(lon);
  precision = Number(precision);

  if (isNaN(lat) || isNaN(lon) || isNaN(precision))
    throw new Error("Invalid geohash");

  let idx = 0; // index into base32 map
  let bit = 0; // each char holds 5 bits
  let evenBit = true;
  let geohash = "";

  let latMin = -90,
    latMax = 90;
  let lonMin = -180,
    lonMax = 180;

  while (geohash.length < precision) {
    if (evenBit) {
      // bisect E-W longitude
      const lonMid = (lonMin + lonMax) / 2;
      if (lon >= lonMid) {
        idx = idx * 2 + 1;
        lonMin = lonMid;
      } else {
        idx = idx * 2;
        lonMax = lonMid;
      }
    } else {
      // bisect N-S latitude
      const latMid = (latMin + latMax) / 2;
      if (lat >= latMid) {
        idx = idx * 2 + 1;
        latMin = latMid;
      } else {
        idx = idx * 2;
        latMax = latMid;
      }
    }
    evenBit = !evenBit;

    if (++bit == 5) {
      // 5 bits gives us a character: append it and start over
      geohash += base32.charAt(idx);
      bit = 0;
      idx = 0;
    }
  }

  return geohash;
};

/**
 * Decode geohash to latitude/longitude (location is approximate centre of geohash cell,
 *     to reasonable precision).
 *
 * @param   {string} geohash - Geohash string to be converted to latitude/longitude.
 * @returns {{lat:number, lon:number}} (Center of) geohashed location.
 * @throws  Invalid geohash.
 *
 * @example
 *     const latlon = Geohash.decode('u120fxw'); // => { lat: 52.205, lon: 0.1188 }
 */
const decode = (geohash) => {
  const these_bounds = bounds(geohash); // <-- the hard work
  // now just determine the centre of the cell...

  const latMin = these_bounds.sw.lat,
    lonMin = these_bounds.sw.lon;
  const latMax = these_bounds.ne.lat,
    lonMax = these_bounds.ne.lon;

  // cell centre
  let lat = (latMin + latMax) / 2;
  let lon = (lonMin + lonMax) / 2;

  // round to close to centre without excessive precision: ⌊2-log10(Δ°)⌋ decimal places
  lat = lat.toFixed(Math.floor(2 - Math.log(latMax - latMin) / Math.LN10));
  lon = lon.toFixed(Math.floor(2 - Math.log(lonMax - lonMin) / Math.LN10));

  return { lat: Number(lat), lon: Number(lon) };
};




/**
 * turn the additionalProperties array to a key => val object
 * @param {object} place 
 */
const additionalPropertiesToObject = (place)=>{
  const formatted = {}
  for(let i = 0, l = place['additionalProperties'].length; i < l; i++){
    let additionalProperty = place['additionalProperties'][i];
    formatted[ additionalProperty['key'] ] = additionalProperty['value']
  }
  return formatted
}









