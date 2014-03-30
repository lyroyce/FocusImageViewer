function setupEvent(){
	highlightImageButtonOnMouseMove();
	imageNavigationOnClick();
	imageNavigationOnKeyDown();
}

function highlightImageButtonOnMouseMove(){
	var nextImageHighlighted = true;
	prevButton().fadeTo('fast', 0.2);
	root().mousemove(function(e){
		var separator = $(window).width()/2;
		if(e.pageX>=separator && !nextImageHighlighted){
			nextButton().fadeTo('fast', 1);
			prevButton().fadeTo('fast', 0.2);
			nextImageHighlighted=true;
		}else if(e.pageX<separator && nextImageHighlighted){
			prevButton().fadeTo('fast', 1);
			nextButton().fadeTo('fast', 0.2);
			nextImageHighlighted=false;
		}
	});
}

function imageNavigationOnClick(){
	var isClick = false;
	var clearClick;
	root().mousedown(function(event){
		 // click should be kept valid on multiple quick click
		clearTimeout(clearClick);
		isClick = true;
		// click is invalid if click too slow
		clearClick = setTimeout(function(){isClick=false;}, 500);
	});
	root().mouseup(function(event){
		if(isClick && event.which!==3){// no right click
			var separator = $(window).width()/2;
			if(event.pageX>separator) nextImage();
			else prevImage();
		}
		clearSelection();
	});
}

function imageNavigationOnKeyDown(){
	root().keydown(function(event){
		if(!event.ctrlKey && event.keyCode==37){//left
			prevImage();
			event.stopPropagation();
		}else if(!event.ctrlKey && event.keyCode==39){//right
			nextImage();
			event.stopPropagation();
		}else if(event.ctrlKey && event.keyCode==37){//CTRL+left
			prevPage();
			event.stopPropagation();
		}else if(event.ctrlKey && event.keyCode==39){//CTRL+right
			nextPage();
			event.stopPropagation();
		}
	});
}