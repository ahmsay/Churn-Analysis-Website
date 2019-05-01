  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/auth'
  import 'firebase/storage'

  var config = {
    apiKey: "AIzaSyDFs0fN4j04smy-0M2uSZIcgo8hgK2SmJA",
    authDomain: "churn-2537f.firebaseapp.com",
    databaseURL: "https://churn-2537f.firebaseio.com",
    projectId: "churn-2537f",
    storageBucket: "churn-2537f.appspot.com",
    messagingSenderId: "1087499090507"
  };

  firebase.initializeApp(config);
  const auth = firebase.auth();
  const db = firebase.firestore();

  db.settings({ timestampsInSnapshots: true });

  export default db;
  export { auth };
  var storageRef = firebase.storage().ref();
  export { storageRef };