import AsyncStorage from '@react-native-async-storage/async-storage';

class UserSettings{

  constructor(){
    this.AsyncStorage = AsyncStorage;
  }

  get( key ){
    return new Promise((resolve,reject)=>{
      if( typeof key !== 'string' ) throw new Error('Key must be a string')
      this.AsyncStorage.getItem( key ).then( value => {
        resolve(JSON.parse( value )) 
      })
    });
  }

  set( key, value ){
    return this.AsyncStorage.setItem( key, JSON.stringify(value) )
  }

}

const userSettings = new UserSettings()

export default userSettings