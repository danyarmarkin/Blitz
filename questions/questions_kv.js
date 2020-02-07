var questions = [];

for(i=11; i<37; i++){
	if (i != 20 and i != 30){
		questions.push([i, i*i]);
		questions.push([i*i, i]);
	}
}
