const fs = require('fs')

const new_format_file = __dirname + '/cycleparking_format_test.json';

const file_content = fs.readFileSync( new_format_file, {encoding: 'utf-8'} )
const file_data = JSON.parse(file_content)
const keys = Object.keys(file_data)

const all_name = {}
const all_standtype = {}
const all_spaces = {}
const all_secure = {}

const stand_examples = {}

let logged_secure = 0

keys.forEach( geohash => {
  const places = file_data[ geohash ]
  places.forEach( place =>{
    const name = place['name'].toString()
    const standtype = place['standtype'].toString()
    const spaces = place['spaces'].toString()
    const secure = place['secure'].toString()
    const image = place['picurl1'].toString()

    if(logged_secure < 3 && secure === 'TRUE'){
      console.log( place )
      logged_secure++
    } 

    if( all_name[ name ] === undefined ) all_name[ name ] = 0
    if( all_standtype[ standtype ] === undefined ) all_standtype[ standtype ] = 0
    if( all_spaces[ spaces ] === undefined ) all_spaces[ spaces ] = 0
    if( all_secure[ secure ] === undefined ) all_secure[ secure ] = 0

    all_name[ name ]++
    all_standtype[ standtype ]++
    all_spaces[ spaces ]++
    all_secure[ secure ]++

    if( stand_examples[ standtype ] === undefined ){
      stand_examples[ standtype ] = [image]
    }else{
      stand_examples[ standtype ].push(image)
    }

    if(stand_examples[ standtype ].length > 3){
      stand_examples[ standtype ].splice(3, stand_examples[ standtype ].length-1)
    }
    

  })
})

console.log(`all_name`, all_name)
console.log(`all_standtype`, all_standtype)
console.log(`all_spaces`, all_spaces)
console.log(`all_secure`, all_secure)
console.log(`stand_examples`, stand_examples)


