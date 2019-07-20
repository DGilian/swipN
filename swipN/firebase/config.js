import firebase from 'firebase';
import { createStore, combineReducers } from 'redux'
import { firebaseReducer } from 'react-redux-firebase';
import GeoFire from 'geofire';

const firebaseConfig = {
  apiKey: "AIzaSyAntFoolOZqB1pLONF7tYV9Cv9Q_cs3pLI",
  authDomain: "swip-6e8e4.firebaseapp.com",
  databaseURL: "https://swip-6e8e4.firebaseio.com",
  projectId: "swip-6e8e4",
  storageBucket: "swip-6e8e4.appspot.com",
  messagingSenderId: "170254203030",
  appId: "1:170254203030:web:db171c1c00b57c39",
};


const rootReducer = combineReducers({
  firebase: firebaseReducer,
  // firestore: firestoreReducer // <- needed if using firestore
})

const rrfConfig = {
  userProfile: 'users',
  // useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
}

// Create store with reducers and initial state
const initialState = {}
export const store = createStore(rootReducer, initialState)

export const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  // createFirestoreInstance // <- needed if using firestore
}

let app = firebase.initializeApp(firebaseConfig);

export const db = app.database();

export const geoFire = new GeoFire(app.database().ref('geoFireNotes'));

// exemple export:

// export const callImg = () =>{
//   const images = firebase.storage().ref().child('swipe/31479554.png');
//   images.getDownloadURL().then((url) => {
//     return url
//   });
// }