const fs = require('fs')
const https = require('https')
const { url } = require('inspector')

const data = fs.readFileSync(`${__dirname}/cycleparking.json`, {encoding:'utf-8'})
const places = JSON.parse(data)
const keys = Object.keys(places)
console.log('keys.length', keys.length);
console.log('keys[0]', keys[0]);

const images_to_test = 300
const urls = []
const promises = []
for(let i=0,l=images_to_test;i<l;i++){
  const key = keys[ getRandomInt(0, keys.length) ]
  const url = places[ key ][0]['picurl']

  //TODO finish this
  promises.push( getImageSize(url) )

  urls.push(url)
}

Promise.all( promises ).then( sizes => {
  console.log('all sizes:', sizes)

  const avg = getAverage( ...sizes )
  console.log(`average size in mb: ${avg}`)

}).catch( console.error )


function getAverage(...numbers){
  let sum = 0
  numbers.forEach( number => {
    sum += number
  })
  return sum / numbers.length
}

function getImageSize(url, in_mb = true){
  return new Promise((resolve,reject)=>{
    https.get( url, ( res ) => {
      let data = ''
      res.on('data', (chunk)=>data+=chunk)
      res.on('end', ()=>{resolve( stringToMb(data) )})
    })
  });
}


console.log('urls', urls);

function stringToMb(string){
  return Buffer.byteLength(string, 'utf-8')  / 1000000
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}


