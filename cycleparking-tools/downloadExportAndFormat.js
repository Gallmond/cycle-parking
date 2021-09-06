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

// true if answer was y or yes
const answerIntent = (ans) => {
  return ['y','yes'].indexOf(ans.toString().trim().toLowerCase()) !== -1
}

const run = async () => {
  
  const do_export = await askQuestion("Would you like to download the TFL export anew (approx 68mb) Y/N ?\r\n");
  if(answerIntent(do_export)){
    // request the file

    getAllCycleParksFromTFL().then( export_text => {
      console.log(`export_text.length: ${export_text.length}`)

      const tfl_export_file = `${os.tmpdir()}/tfl_cycleparks.json`
      fs.writeFile( tfl_export_file, export_text, {encoding:'utf-8'}, ()=>{
        console.log(`saved file to ${tfl_export_file}`)
      })

    }).catch( console.error )


  }



}

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





run();



