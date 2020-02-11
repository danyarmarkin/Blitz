var answers = [];
var myTimer;
var isPaused = false;
var img_size = 500;


$(document).ready(function(){
      document.getElementById("pause_btn").disabled = true;
	  document.getElementById("number_of_questions").max = questions.length;
	  document.getElementById("number_of_questions").min = 1;
})




//выбрать произвольный элемент из массива arr
function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function count(s, pattern){
	return (s.split(pattern).length - 1);
}


function isImg(s){
	s = s.toString();
	if (count(s,'.jpg') != 0 | count(s,'.png') != 0 | count(s,'.jpeg') != 0){return true;}
	else {return false;}
}

function number_of_questions_change(){
	var el = document.getElementById("number_of_questions");
    var warning_div = document.getElementById("max_questions_warning");

	if (parseInt(el.value) > parseInt(el.max)){
		el.value = el.max;
		warning_div.innerHTML = "(максимальное количество вопросов в этом тесте - " + (questions.length).toString() + ")";
		warning_div.style.display = "block";
		warning_div.style.color = "red";
		}
	else if (parseInt(el.value) < parseInt(el.min)){
		el.value = el.min;
		}
	else{
		warning_div.style.display = "none";
	}
}

function show_answers_row_column(){
	var el = document.getElementById("row_column_checkbox");
	var ans_div = document.getElementById("answers");
	ans_div.innerHTML = '';
	if (el.checked){
		
		for(i=0; i<answers.length; i++){
			
			var sp = document.createElement('span');
			sp.innerHTML = (i+1).toString() + ') ';
			
			var hr = document.createElement('hr');
			hr.width = "20%";
			
			ans_div.appendChild(sp);
			ans_div.appendChild(answers[i]);
//			ans_div.appendChild(document.createElement('br'));
			ans_div.appendChild(hr);
		}
	}
	else{
		for(i=0; i<answers.length; i++){
			ans_div.appendChild(answers[i]);
			var sp = document.createElement('span');
			sp.innerHTML = '; ';
			ans_div.appendChild(sp);
		}
	}
	
  	ans_div.removeChild(ans_div.lastChild);
	MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
			
}


function show_answers(){
    if (document.getElementById("showans_btn").innerHTML === 'Показать ответы'){
        document.getElementById("showans_btn").innerHTML = 'Скрыть ответы';
		show_answers_row_column();
		change_img_size();
    }
    else if (document.getElementById("showans_btn").innerHTML === 'Скрыть ответы'){
        document.getElementById("showans_btn").innerHTML = 'Показать ответы';
        document.getElementById("answers").textContent = '';
    }

}

function timer() {
	stop();
    document.getElementById("pause_btn").disabled = false;
    document.getElementById("start_btn").disabled = true;

    var dur = document.getElementById("duration").value*100;
    var number_of_questions = document.getElementById("number_of_questions").value;
    var prolog_time = 400;
    var qs = JSON.parse(JSON.stringify(questions));
    answers = [];
    var timeleft = dur*(number_of_questions)+prolog_time;
    myTimer = setInterval(function () {
        if (isPaused == false){
			//document.getElementById("countdowntimer").textContent = ((timeleft+2) % dur).toString();

			if (timeleft !== 0 && timeleft <= dur*(number_of_questions)) {
				document.getElementById("progress_bar").value = ((timeleft+2) % dur)/dur*100;
			}

			if (timeleft > dur*(number_of_questions)) {
				document.getElementById("progress_bar").value = ((prolog_time - (dur*(number_of_questions)-timeleft))/prolog_time - 1) * 100;
				document.getElementById("question").textContent = 'Внимание...';
			}
			
			if (timeleft % dur === 0 && timeleft !== 0 && timeleft <= dur*(number_of_questions)) {
				var questions_div = document.getElementById("question");

				questions_div.style.visibility = 'hidden';
				setTimeout(function(){
					questions_div.style.visibility = "visible"; 
				}, 500);

				if (qs.length === 0){
					clearInterval(myTimer);
					document.getElementById("question").textContent = 'тест завершён, заданы все возможные вопросы' + ' (' +count(answers, ";")+' шт.)';
					document.getElementById("start_btn").disabled = false;
					document.getElementById("progress_bar").value = 0;
					document.getElementById("pause_btn").innerHTML = 'Пауза';
					document.getElementById("pause_btn").disabled = true;
					isPaused = false;

				}
				else{
					var el = choice(qs);
					qs.splice(qs.indexOf(el), 1 );
					
					if (isImg(el[0])){
						document.getElementById("question_img").style.display = "block";
						questions_div.style.display = "none"; 
						answers.push(addimg(el[1]));
						document.getElementById("question_img").src = el[0];
						change_img_size();						
					}
					else{
						document.getElementById("question_img").style.display = "none";
						questions_div.style.display = "block"; 
						
						questions_div.textContent = el[0];
						var sp = document.createElement('span');
						sp.innerHTML = el[1];
						answers.push(sp);
						MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
					}
				}
			}
			
			if (timeleft <= 0) {
				clearInterval(myTimer);
				document.getElementById("question_img").style.display = "none";
				document.getElementById("question").style.display = "block"; 
				document.getElementById("question").textContent = 'тест завершён';
				document.getElementById("start_btn").disabled = false;
				document.getElementById("progress_bar").value = 0;

				document.getElementById("pause_btn").innerHTML = 'Пауза';
				document.getElementById("pause_btn").disabled = true;
				isPaused = false;

			}
			timeleft--;
			}
		}, 10);
}

function change_font_size(t = false){
        var size = document.getElementById("font_size").value;
        var el = document.getElementById("question")
    if (t === false){
        el.style.fontSize = size.toString()+'px';
    }
    else{
        el.style.fontSize = t.toString()+'px';    
    }
}

function change_ans_font_size(t = false){
        var size = document.getElementById("ans_font_size").value;
        var el = document.getElementById("answers")
    if (t === false){
        el.style.fontSize = size.toString()+'px';
    }
    else{
        el.style.fontSize = t.toString()+'px';    
    }
}


function stop(){
        answers = '';
		document.getElementById("question_img").style.display = "none";
        document.getElementById("question").textContent = '';
        document.getElementById("start_btn").disabled = false;
        document.getElementById("progress_bar").value = 0;
        document.getElementById("pause_btn").innerHTML = 'Пауза';
        document.getElementById("pause_btn").disabled = true;
	
        document.getElementById("showans_btn").innerHTML = 'Показать ответы';
        document.getElementById("answers").textContent = '';

        isPaused = false;
        clearInterval(myTimer);
	
}


function pause(){
        if(isPaused == false){
            isPaused = true;
            document.getElementById("pause_btn").innerHTML = 'Продолжить';
        }
        else {
            isPaused = false;
            document.getElementById("pause_btn").innerHTML = 'Пауза';
        }
}

function row_column_ans(){
	if (document.getElementById("showans_btn").innerHTML === 'Скрыть ответы'){
		show_answers_row_column();
	}   
}


 function addimg(file) { 
            var img = new Image(); 
            img.src = file;
	 		img.style = "vertical-align: middle;";
	 		return img;
        }  

function change_img_size(){

        var size = document.getElementById("img_size").value;
	    img_size = size;
        $("img").each(function () {
			var width = $(this).width();
                $(this).attr({
                	width : size
				})
		})
}
