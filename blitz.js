var answers = [];
var myTimer;
var isPaused = false;
var img_size = 500;


$(document).ready(function(){
      document.getElementById("pause_btn").disabled = true;
	  set_questions_theme();
	  document.getElementById("number_of_questions").max = qsts.length;
	  document.getElementById("number_of_questions").min = 1;
})




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
    document.getElementById("select_questions").disabled = true;

    var dur = document.getElementById("duration").value*100;
    var number_of_questions = document.getElementById("number_of_questions").value;
    var prolog_time = 400;
    var qsts = JSON.parse(JSON.stringify(questions));
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

				if (qsts.length === 0){
					clearInterval(myTimer);
					document.getElementById("question").textContent = 'тест завершён, заданы все возможные вопросы' + ' (' +count(answers, ";")+' шт.)';
					document.getElementById("start_btn").disabled = false;
					document.getElementById("progress_bar").value = 0;
					document.getElementById("pause_btn").innerHTML = 'Пауза';
					document.getElementById("pause_btn").disabled = true;
					isPaused = false;

				}
				else{
					var el = choice(qsts);
					qsts.splice(qsts.indexOf(el), 1 );
					
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
			    document.getElementById("select_questions").disabled = false;

			}
			timeleft--;
			}
		}, 10);
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

	    document.getElementById("select_questions").disabled = false;
	
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
