var database = firebase.database();
var testName;

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

}

function getQuestionNumber(){

    if(result == 'null'){
      console.log("ok");
      return 1;
    }
    return result+1;


}
