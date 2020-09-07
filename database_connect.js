var database = firebase.database();
var testName;
var tableVisible = false;

var users = [];
var questions = 0;

function errorTest(){
  var next = document.getElementById('next_question');
  var name = document.getElementById('test_name').value;
  testName = name;
  if(name.includes(".") || name.includes("#") || name.includes("$") || name.includes("[") || name.includes("]") || name == "users" || name.includes(" ")){
    document.getElementById('error_test_name').innerHTML = 'Невозможное название! \n Название теста не должно содержать такие символы как "#","$",".","[","]" и не быть "users"';
    next.disabled = true;
  }else
  if(name != ''){
    const dbResObject = firebase.database().ref().child(document.getElementById('test_name').value);
      dbResObject.on('value', snap => {
       console.log(snap.val());
       var result = JSON.stringify(snap.val(), null, 3).replace(/['"]+/g, '');
       if (result != 'null'){
         document.getElementById('error_test_name').innerHTML = 'Название этого теста уже занято!';
         // next.disabled = true;
         if(name != null){
        		next.disabled = false;
        	}else{
            next.disabled = true;
          }
       } else {
         document.getElementById('error_test_name').innerHTML = 'Название свободно!';
         if(name != null){
        		next.disabled = false;
        	}else{
            next.disabled = true;
          }
       }

     });
  }else{
    next.disabled = true;
  }

}

function pushQuestion(q, a){
  var num;
  var n;
  const dbAnswer = firebase.database().ref(testName + '/answers/answer');
  dbAnswer.once('value', snap => {
    var result = JSON.stringify(snap.val(), null, 3).replace(/['"]+/g, '');
    num = result;
  });
  console.log(num);
  n = (num == 'null')?1:parseInt(num)+1;
  database.ref(testName + '/task').set(n+'#'+q);
  database.ref(testName + '/answers/answer' + n).set(a);
  database.ref(testName + '/answers/answer').set(n);

}

function showResults(){
  tableVisible = tableVisible?false:true;
  updateTable();

  setValues();
  console.log(users[0]);

}

function getQuestionNumber(){

    if(result == 'null'){
      console.log("ok");
      return 1;
    }
    return result+1;


}

function setValues(){

 const preObject = document.getElementById('object');
 const dbQuestions = firebase.database().ref(testName + '/answers/answer');
 const dbUsersId = firebase.database().ref(testName + '/users');
 dbQuestions.once('value', snap => {
   console.log(snap.val());
   var result = JSON.stringify(snap.val(), null, 3).replace(/['"]+/g, '');
   questions = result;
   console.log(questions);
  });

  dbUsersId.once('value', snap => {
    console.log(snap.val());
    console.log(Object.keys(snap.val()));
    var usersId = Object.keys(snap.val());
    for(var i=0; i<usersId.length;i++){
      users[i] = getUserName(usersId[i], i);
      users.sort();
    }
   });

}

function getUserName(key, i){
  var result;
  const dbUser= firebase.database().ref(testName + '/users/' + key);
  dbUser.once('value', snap => {
    console.log(snap.val());
    result = JSON.stringify(snap.val(), null, 3).replace(/['"]+/g, '');

   });
   return result;
}

function getUsersAnswer(userName, n){
  const dbUsersId = firebase.database().ref(testName + '/users');

  var result;
  var userId;
  dbUsersId.once('value', snap => {
    console.log(snap.val());
    console.log(Object.keys(snap.val()));
    var usersId = Object.keys(snap.val());
    for(var i=0; i<usersId.length;i++){
      if(userName == getUserName(usersId[i], i)) userId=usersId[i];
    }
   });
  const dbUser= firebase.database().ref(testName + '/users_answers/' + userId + '_' + n);
  dbUser.once('value', snap => {
    console.log(snap.val());
    result = JSON.stringify(snap.val(), null, 3).replace(/['"]+/g, '').replace('\\', '');
    result.replace('\\', '\\\\');
   });
   return result;
}

function getTrueAnswer(n){
  var result;
  const dbTrueAns= firebase.database().ref(testName + '/answers/answer' + n);
  dbTrueAns.once('value', snap => {
    console.log(snap.val());
    result = JSON.stringify(snap.val(), null, 3).replace(/['"]+/g, '').replace('\\', '');
    result.replace('\\', '\\\\');
   });
   return result;
}

function updateTable(){
  if(document.getElementById('results_table') != null)document.getElementById('results_table').parentNode.removeChild(document.getElementById('results_table'));

  setValues();

  var body = document.getElementsByTagName('body')[0];
  var tbl = document.createElement('table');
  tbl.style.width = '100%';
  tbl.setAttribute('border', '1');
  tbl.setAttribute('id', 'results_table');
  var tbdy = document.createElement('tbody');
  for (var i = -1; i < users.length; i++) {
    var tr = document.createElement('tr');
    var sum = 0;
    for (var j = 0; j <= questions; j++) {
      var td = document.createElement('td');
      if (j === 0 && i != -1) {
        // td.appendChild(document.createElement('div'));
        td.innerHTML = users[i];
      }
      if(i === -1){
        td.innerHTML = j;
        if(j === 0){
          td.innerHTML = '#';
        }
      }
      if(i != -1 && j != 0){
        td.innerHTML = getUsersAnswer(users[i],j);
      }
      tr.appendChild(td);
      if(getTrueAnswer(j) == getUsersAnswer(users[i], j)) sum++;
    }

    var td = document.createElement('td');
    td.setAttribute('id', 'final'+i);
    (i === -1)? td.innerHTML = 'Итого': td.innerHTML = sum +'/'+questions;
    tr.appendChild(td);
    tbdy.appendChild(tr);
  }
  tbl.appendChild(tbdy);
  body.appendChild(tbl);
  tableVisible?tbl.style.display='inline':tbl.style.display='none';
  console.log(getUsersAnswer(users[0],6));
  MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
}
updateTable();

// let timer = setInterval(()=>updateTable(), 500);
