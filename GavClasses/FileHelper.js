const { stat } = require('react-native-fs');

/**
 * Just a wrapper for react-native-fs really
 * Uses DocumentDirectoryPath as default 'root' path
 */
class FileHelper{
  constructor(){
  // https://github.com/itinance/react-native-fs#Examples
    this.RNFS = require('react-native-fs');

    // /data/user/0/com.awesomeproject2/files
    this.deviceFolder = this.RNFS.DocumentDirectoryPath
  }

  /**
   * @param {string} filePath 
   * @returns {Array} array of objects with properties:
   *   ctime (changed timestamp )
   *   isDirectory() (function returns bool)
   *   isFile() (function returns bool)
   *   mtime (modified timestamp)
   *   name (file name)
   *   path (existing path)
   *   size (in bytes)
   */
  async readDir( dirPath = '' ){
    return await this.RNFS.readDir( this.deviceFolder + dirPath )
  }

  /**
   * @param {string} path path to file
   * @returns {Object} like:
   * {
   *   "path": "/data/user/0/com.awesomeproject2/files/DATA_disk_creation_time_its",
   *   "ctime": "2021-09-04T19:03:16.000Z",
   *   "mtime": "2021-09-04T19:03:16.000Z",
   *   "size": 8,
   *   "originalFilepath": "/data/user/0/com.awesomeproject2/files/DATA_disk_creation_time_its"
   * },
   */
  async stat( path ){
    return await this.RNFS,stat(this.deviceFolder + path)
  }

  /**
   * @param {string} filePath file path relative to doc dir
   * @param {string} encoding utf8, ascii, or base64. use base64 for binary data
   * @returns file content
   */
  async readFile( filePath, encoding='utf8' ){ 
    return await this.RNFS.readFile( this.deviceFolder + filePath, encoding )
  }

  /**
   * Creates a given file path starting at doc dir.
   * Must be string starting with /
   * Parents are created automatically (ie, don't have to step through the 
   * whole path)
   * 
   * @param {String} path path directory to create
   * @returns {Promise}
   */
  async mkDir( path ){
    if(!this.filePathValid(path)){
      throw new Error(`invalid path ${String(path)}`)
    }
    return await this.RNFS.mkdir( this.deviceFolder + path )
  }

  /**
   * @param {string} path file path
   * @returns promise with bool if item exists
   */
  async exists( path ){
    console.log(`FileHelper.exists( ${this.deviceFolder + path} )`)
    return await this.RNFS.exists( this.deviceFolder + path )
  }

  /**
   * write content to a given file path.
   * Note that path to file MUST exist
   * Note: Documentation implies resolves with bool but that doesn't seem to be
   *  the case
   * 
   * @param {String} filePath filePath
   * @param {String} content file data
   * @param {String} encoding file data encoding (default UTF8)
   * @returns {Promise}
   */
  async writeFile( filePath, content, encoding='utf8'){
    return await this.RNFS.writeFile( this.deviceFolder + filePath, content, encoding )
  }

  /**
   * Sanity checks file path
   * 
   * @param {string} filePath filePath
   * @returns {bool}
   */
  filePathValid( filePath ){
    return (
      // must be a string
      typeof filePath === 'string'
      // with characters other than /
      && filePath.length > 1
      // starting with /
      && filePath.indexOf('/') === 0
    )
  }

}

export default FileHelper