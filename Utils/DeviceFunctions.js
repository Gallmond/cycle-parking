import { PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

/**
 * resolves true if permission is granted, false otherwise
 * @returns Promise<bool>
 */
export const requestDeviceLocationPermission = ()=>{
  return new Promise((resolve,reject)=>{
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((hasPermission)=>{
      if(hasPermission) resolve(hasPermission)
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(status => {
        resolve(status === PermissionsAndroid.RESULTS.GRANTED)
      })
    }).catch(reject)
  });
}

/**
 * resolves with current device position
 * 
 * @returns Geoposition
 */
export const getCurrentDeviceLocation = ()=>{
  return new Promise((resolve,reject)=>{
    requestDeviceLocationPermission().then(granted => {
      if(granted){
        const geoLocationOptions = {
          timeout: 10000,
          maximumAge: 10000,
          enableHighAccuracy: true
        }
        Geolocation.getCurrentPosition((position)=>{
          resolve(position)
        },(error)=>{
          reject(error)
        },geoLocationOptions)
      }else{
        reject({error:true,message:'user did not grant location permissions'})
      }
    })
  });
}