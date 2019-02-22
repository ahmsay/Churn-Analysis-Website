  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/auth'

  var config = {
    apiKey: "AIzaSyDFs0fN4j04smy-0M2uSZIcgo8hgK2SmJA",
    authDomain: "churn-2537f.firebaseapp.com",
    databaseURL: "https://churn-2537f.firebaseio.com",
    projectId: "churn-2537f"
  };

  firebase.initializeApp(config);
  const auth = firebase.auth();
  const db = firebase.firestore();

  db.settings({ timestampsInSnapshots: true });

  export default db;
  export { auth };