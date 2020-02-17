var questions_sqr= [];

for(i=11; i<37; i++){
	if (i != 20 && i != 30){
		questions_sqr.push([i, i*i]);
		questions_sqr.push([i*i, i]);
	}
}
