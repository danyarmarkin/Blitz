var answers = [];
var qs = JSON.parse(JSON.stringify(questions));
var img_size = 500;

$(document).ready(function(){
	document.getElementById("showOneAnsBtn").disabled = true;
	document.getElementById("showAllAnsBtn").disabled = true;
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
		document.getElementById("answer_img").style.display = "inline";
		document.getElementById("answer_img").src = src;
		
		change_img_size();
		
		MathJax.Hub.Queue(["Typeset", MathJax.Hub]);		
    }
    else if (document.getElementById("showOneAnsBtn").innerHTML === 'Скрыть ответ'){
        document.getElementById("showOneAnsBtn").innerHTML = 'Показать текущий ответ';
        document.getElementById("answer_img").style.display = "none";
    }

}

function next_question() {
	document.getElementById("showOneAnsBtn").disabled = false;
	document.getElementById("showAllAnsBtn").disabled = false;
	document.getElementById("showOneAnsBtn").innerHTML = 'Показать текущий ответ';
    document.getElementById("answer_img").style.display = "none";
	document.getElementById("showAllAnsBtn").innerHTML = 'Показать все ответы';
    document.getElementById("answers").textContent = '';
    var questions_div = document.getElementById("question");
	
	if (qs.length === 0){
		document.getElementById("question").textContent = 'заданы все возможные вопросы';
		document.getElementById("next_question").disabled = true;
	}
	else{
		var el = choice(qs);
		qs.splice(qs.indexOf(el), 1 );

		if (isImg(el[0])){
			document.getElementById("question_img").style.display = "inline";
			questions_div.style.display = "none"; 
			answers.push(addimg(el[1]));
			document.getElementById("question_img").src = el[0];
			change_img_size();

		}
		else{
			document.getElementById("question_img").style.display = "none";
			questions_div.style.display = "inline"; 
			questions_div.textContent = el[0];
			var sp = document.createElement('span');
			sp.innerHTML = el[1];
			answers.push(sp);
			MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
		}
	}

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
        answers = [];
	    document.getElementById("answer_img").style.display = "none";
		document.getElementById("showOneAnsBtn").disabled = true;
		document.getElementById("showAllAnsBtn").disabled = true;
		document.getElementById("question_img").style.display = "none";		
		document.getElementById("next_question").disabled = false;
        document.getElementById("question").textContent = '';	
        document.getElementById("showAllAnsBtn").innerHTML = 'Показать ответы';
        document.getElementById("answers").textContent = '';
		document.getElementById("answers").textContent = '';
		qs = JSON.parse(JSON.stringify(questions));
}


function row_column_ans(){
	if (document.getElementById("showAllAnsBtn").innerHTML === 'Скрыть ответы'){
		show_answers_row_column();
	}   
}


 function addimg(file) {
	 
            var img = new Image(); 
            img.src = file;
	 		
	 		img.style = "vertical-align: middle; width: "+img_size.toString()+";";
	 		
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
