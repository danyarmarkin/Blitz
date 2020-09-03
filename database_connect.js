var database = firebase.database();
var testName;

function errorTest(){
  var next = document.getElementById('next_question');
  var name = document.getElementById('test_name').value;
  testName = name;
  const dbResObject = firebase.database().ref().child(document.getElementById('test_name').value);
    dbResObject.on('value', snap => {
     console.log(snap.val());
     var result = JSON.stringify(snap.val(), null, 3).replace(/['"]+/g, '');
     if (result != 'null'){
       document.getElementById('error_test_name').innerHTML = 'Название этого теста уже занято!';
       // next.disabled = true;
     } else {
       document.getElementById('error_test_name').innerHTML = 'Название свободно!';
       if(name != null){
      		next.disabled = false;
      	}else{
          next.disabled = true;
        }
     }

   });
}

function pushQuestion(q){
  database.ref(testName + '/task').set(q);
}
