(function(){
  var firebaseConfig = {
    apiKey: "AIzaSyDEAR6Li42tIKbQ3XuyHHzQZBbkXv-HnFk",
    authDomain: "onlinetest-e2140.firebaseapp.com",
    databaseURL: "https://onlinetest-e2140.firebaseio.com",
    projectId: "onlinetest-e2140",
    storageBucket: "onlinetest-e2140.appspot.com",
    messagingSenderId: "60078891411",
    appId: "1:60078891411:web:c305d180dbe01dbe5ac866",
    measurementId: "G-40Z9H2RWLP"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();


 // const preObject = document.getElementById('object');
 // const dbResObject = firebase.database().ref().child('23231answer1');
 // const dbAnswer = firebase.database().ref().child('answer1');
 // dbResObject.on('value', snap => {
 //   console.log(snap.val());
 //   var result = JSON.stringify(snap.val(), null, 3).replace(/['"]+/g, '');
 //   preObject.innerHTML = result;
 //
 //   dbAnswer.on('value', ansSnap => {
 //     var answer = JSON.stringify(ansSnap.val(), null, 3).replace(/['"]+/g, '');
 //
 //     if(result == answer){
 //       document.getElementById('check_answer').innerHTML = 'Верно!';
 //     } else {
 //       document.getElementById('check_answer').innerHTML = 'Неверно!';
 //     }
 //   });
 // });
}());
