var answers = [];
var img_size = 500;

$(document).ready(function(){
	document.getElementById("showOneAnsBtn").disabled = true;
	document.getElementById("showAllAnsBtn").disabled = true;
	set_questions_theme();
	qsts = JSON.parse(JSON.stringify(questions));
})


function showAllAns(){
    if (document.getElementById("showAllAnsBtn").innerHTML === 'Показать все ответы'){
        document.getElementById("showAllAnsBtn").innerHTML = 'Скрыть ответы';
		show_answers_row_column();
		change_img_size();
    }
    else if (document.getElementById("showAllAnsBtn").innerHTML === 'Скрыть ответы'){
        document.getElementById("showAllAnsBtn").innerHTML = 'Показать все ответы';
        document.getElementById("answers").textContent = '';
    }

}


function showOneAns(){
    if (document.getElementById("showOneAnsBtn").innerHTML === 'Показать текущий ответ'){
        document.getElementById("showOneAnsBtn").innerHTML = 'Скрыть ответ';
		//document.getElementById("showAllAnsBtn").innerHTML = 'Показать все ответы';
		var src = answers[answers.length - 1].src;
		if (!src){
			document.getElementById("answer").removeChild(document.getElementById("answer").lastChild);
			document.getElementById("answer").appendChild(answers[answers.length - 1].cloneNode(true));
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
			document.getElementById("answer").style.display = "block";
		}
		else{
			document.getElementById("answer_img").style.display = "inline";
			document.getElementById("answer_img").src = src;
			change_img_size();
		}
    }
    else if (document.getElementById("showOneAnsBtn").innerHTML === 'Скрыть ответ'){
        document.getElementById("showOneAnsBtn").innerHTML = 'Показать текущий ответ';
        document.getElementById("answer_img").style.display = "none";
		document.getElementById("answer").style.display = "none";
	}

}

function next_question() {
	document.getElementById('test_name').disabled = true;
	document.getElementById("showOneAnsBtn").disabled = false;
	document.getElementById("showAllAnsBtn").disabled = false;
	document.getElementById("showOneAnsBtn").innerHTML = 'Показать текущий ответ';
    document.getElementById("answer_img").style.display = "none";
	document.getElementById("answer").style.display = "none";
	document.getElementById("showAllAnsBtn").innerHTML = 'Показать все ответы';
    document.getElementById("answers").textContent = '';
    var questions_div = document.getElementById("question");
		updateTable();

	if (qsts.length === 0){
		document.getElementById("question").textContent = 'заданы все возможные вопросы';
		document.getElementById("next_question").disabled = true;
		document.getElementById("answer").innerHTML = "";
		document.getElementById("showOneAnsBtn").disabled = true;

	}
	else{
		var el = choice(qsts);
		qsts.splice(qsts.indexOf(el), 1 );

		if (isImg(el[0])){
			document.getElementById("question_img").style.display = "inline";
			questions_div.style.display = "none";
			answers.push(addimg(el[1]));
			document.getElementById("question_img").src = el[0];
			change_img_size();

		}
		else{
			document.getElementById("question_img").style.display = "none";
			pushQuestion(el[0], el[1]);
			questions_div.style.display = "inline";
			questions_div.textContent = el[0];
			var sp = document.createElement('span');
			sp.innerHTML = el[1];
			answers.push(sp);

			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		}
	}

}



function stop(){
        answers = [];
				document.getElementById('test_name').disabled = false;
	    document.getElementById("answer_img").style.display = "none";
		document.getElementById("showOneAnsBtn").disabled = true;
		document.getElementById("showAllAnsBtn").disabled = true;
		document.getElementById("question_img").style.display = "none";
		document.getElementById("next_question").disabled = false;
        document.getElementById("question").textContent = '';
        document.getElementById("showAllAnsBtn").innerHTML = 'Показать ответы';
        document.getElementById("answers").textContent = '';
		document.getElementById("answers").textContent = '';
		errorTest();
		qsts = JSON.parse(JSON.stringify(questions));
}


function row_column_ans(){
	if (document.getElementById("showAllAnsBtn").innerHTML === 'Скрыть ответы'){
		show_answers_row_column();
	}
}
(function(){

}());
