import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 'bookmarks' key contains an array of cyclepark ids
 * 'alwaysShowImages' key contains true|false key
 */
class UserSettings {
  constructor() {
    this.AsyncStorage = AsyncStorage;

    /**
     * if a value is larger than this many bytes, store it with the large methods
     */
    this.largeValueMinSize = 1000000;
  }

  get(key) {
    return new Promise((resolve, reject) => {
      if (typeof key !== 'string') throw new Error('Key must be a string');
      this.AsyncStorage.getItem(key).then(value => {
        resolve(JSON.parse(value));
      });
    });
  }

  /**
   *
   * @param {string} key key
   * @param {mixed} value value
   * @returns promise with an err, if any
   */
  set(key, value) {
    return this.AsyncStorage.setItem(key, JSON.stringify(value));
  }

}

const userSettings = new UserSettings();

export default userSettings;
