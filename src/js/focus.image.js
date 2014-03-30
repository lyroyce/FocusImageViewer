
var originalImages = [];
var currentIndex = -1;
var img_size_limit = 120;

function loadImages(){
	originalImages = [];
	$("img").each(function(){
		if(this.height===0){
			this.onload = checkImage;
		}else{
			checkImage(this);
		}
	});
	if(originalImages.length>0) nextImage();
}

function checkImage(image){
	if(acceptImage(image)){
		originalImages.push($(image));
	}
}

function acceptImage(img){
	return img.height>=img_size_limit&&img.width>=img_size_limit;
}

function hasNextImage(){
	return currentIndex<originalImages.length-1;
}

function hasPrevImage(){
	return currentIndex>0;
}

function nextImage(){
	if(hasNextImage()){
		showImage(++currentIndex);
	}else{
		nextPage();
	}
}

function prevImage(){
	if(hasPrevImage()){
		showImage(--currentIndex);
	}else{
		prevPage();
	}
}

function nextPage(){
	if(nextPageButton().is('a')){
		root().css('cursor', 'progress');
		nextPageButton()[0].click();
	}
}

function prevPage(){
	if(prevPageButton().is('a')){
		root().css('cursor', 'progress');
		prevPageButton()[0].click();
	}
}

function showImage(index){
	if(originalImages.length>0){
		var image = originalImages[index];
		image.on('load', function(){
			updateCard(image);
		});
		updateCard(image);
		image.ScrollTo('top');
	}
}

function updateCard(image){
	var src = image.attr('src') || image.attr('data-src') || image.attr('original');
	var desc = findRelatedText(image);
	var summary = (currentIndex+1)+'/'+originalImages.length;
	 // add a <br> to make sure image and description won't be in the same line
	card().empty().append('<img src="'+src+'"><br>')
		.append('<div class="fdesc"><span>'+summary+'</span><div>'+desc+'</div><br><br></div>');
	content().focus();
}

function findRelatedText(image){

	var obj = findParentWithText(image);
	if(obj.children().length>5){
		return ""; // too many elements, probably beyond the scope 
	}else{
		// remove all images and scripts from description
		// remove any possible style constraint
		return obj.html().replace(/<img[^>]+>/gi, '')
				.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
				.replace(/class="[^"]*"/gi, '').replace(/style="[^"]*"/gi, '').replace(/id="[^"]*"/gi, '');
	}
}

function findParentWithText(image){
	var obj = image;
	do{
		obj = obj.parent();
	}while(!obj.text().trim());
	return obj;
}
