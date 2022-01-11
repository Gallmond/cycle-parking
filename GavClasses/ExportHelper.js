import { file } from "@babel/types"
import axios from "axios"
import FileHelper from "./FileHelper"

/**
 * purpose of this class is to provide helpers for downloading/accessing the
 * raw TFL exports IN-APP
 */
class ExportHelper{

  constructor(){
    console.log('ExportHelper.constructor()')

    this.fh = new FileHelper()

    this.config = {
      tfl: {
        api_domain: 'api.tfl.gov.uk',
      },
      nameFormats:{
        rawPrefix: 'cycleparkingdata.raw.', //'cycleparkingdata.raw.YYYY-MM-DD.json',
        formattedPrefix: 'cycleparkingdata.formatted.', //'cycleparkingdata.formatted.YYYY-MM-DD.json',
      }
    }

  }

  /**
   * 
   * @returns {object} the ENTIRE CyclePark data
   */ 
  getCycleParkDataFromTFL(filePath = null){
    console.log('ExportHelper.getCycleParkDataFromTFL(filePath)', filePath)
    return new Promise((resolve,reject)=>{
      const placeType = 'CyclePark'
      const uri = `https://${this.config.tfl.api_domain}/Place/Type/${placeType}`
      axios.get(uri).then(res => {
        // responded with status 2xx
        console.log('res.status', res.status)
        console.log('typeof res.headers', typeof res.headers)
        if(typeof filePath === 'string'){
          console.log(`attempt to write ${filePath}`)
          this.fh.writeFile(filePath, res.data, 'base64').then( success => {
            console.log(`created file ${filePath}`)
            resolve(res.data)
          }).catch(err=>{
            console.log('writeFile was caught', err)
          })
        }else{
          resolve(res.data)
        }
      }).catch( err=>{
        if(err.response){
          // responded with status != 2xx
          reject({
            error: true,
            message: `responded with status: ${err.response.status}`,
            code: err.response.status,
          });
        }else{
          // something else went wrong
          reject({
            error: true,
            message: err.message,
          });
        }
      })
    });
  }


  /**
   * @returns {String} "/cycleparkingdata.raw.2021-12-25.json"
   */
  newExportFilePath(){
    console.log('ExportHelper.newExportFilePath()')
    const yyyymmdd = new Date().toISOString().split('T')[0]
    return `${this.config.nameFormats.rawPrefix}${yyyymmdd}.json`
  }

  /**
   * @returns {String} "/cycleparkingdata.formatted.2021-12-25.json"
   */
  newFormattedFilePath(){
    console.log('ExportHelper.newFormattedFilePath()')
    const yyyymmdd = new Date().toISOString().split('T')[0]
    return `${this.config.nameFormats.formattedPrefix}${yyyymmdd}.json`
  }


  /**
   * download and save export with todays yyyy-mm-dd
   */
  async downloadCycleParkExportToday(){
    console.log('ExportHelper.downloadCycleParkExportToday()')
    this.getCycleParkDataFromTFL( this.newExportFilePath() )

    // const freshData = await this.getCycleParkDataFromTFL()
    // const filePath = this.newExportFilePath()
    // this.fh.writeFile(filePath, JSON.stringify(freshData)).then( success => {
    //   console.log(`created file ${filePath}`)
    // })
  }

  /**
   * Get an array of file paths of stored raw TFL exports
   * @returns {Array}
   */
  async getStoredExports(){
    return await this.getStored('raw')
  }
  /**
   * Get an array of file paths of stored formatted cycleparking data
   * @returns {Array}
   */
  async getStoredFormatted(){
    return await this.getStored('formatted')
  }

  /**
   * @param {string} type 'raw' or 'formatted'
   * @returns array of file paths
   */
  async getStored(type){
    if(['raw','formatted'].indexOf(type)===-1){
      throw new Error('invalid data type')
    }
    let prefix;
    if(type === 'raw'){
      prefix = this.config.nameFormats.rawPrefix
    }else if (type === 'formatted'){
      prefix = this.config.nameFormats.formattedPrefix
    }

    let results = await this.fh.readDir()

    const foundExports = []
    results.forEach(result => {
      if(
        result.isFile()
        && result.name.indexOf(prefix) === 0
      ){
        foundExports.push( result.path )
      }
    })
    return foundExports.sort()
  }

}

export default ExportHelper