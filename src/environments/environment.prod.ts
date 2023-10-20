// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  name: 'Producción',
  gateway: 'https://pokeapi.co/api/v2',
  apikey: '',
  production: true,
  googleMapsApikey: 'AIzaSyAvkUxHisR7OqMyz32uR_wv8KBsno3flFM',
  firebaseConfig: {
    apiKey: 'AIzaSyDm-AvEErJaTOkpKudDGhhRPsK0pUYd64M',
    authDomain: 'ionic-capacitor-generic.firebaseapp.com',
    projectId: 'ionic-capacitor-generic',
    storageBucket: 'ionic-capacitor-generic.appspot.com',
    messagingSenderId: '670034150569',
    appId: '1:670034150569:web:060bfa350149e920a555b8',
    measurementId: 'G-B49HY2FGT2'
  },
  uri: {
    pokemon: {
      list: '/pokemon',
    },
  },
  url: {
    googleMapsReverseGeocoding: 'https://maps.googleapis.com/maps/api/geocode/json'
  }
};