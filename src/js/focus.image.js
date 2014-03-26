
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
	nextImage();
}

function checkImage(image){
	if(acceptImage(image)){
		originalImages.push($(image));
	}
}

function acceptImage(img){
	return img.height>=img_size_limit&&img.width>=img_size_limit;
}

function nextImage(){
	if(++currentIndex>=originalImages.length){
		currentIndex=originalImages.length - 1;
		nextPage().click();
	}else{
		showImage(currentIndex);
	}
}

function prevImage(){
	if(--currentIndex<0){
		currentIndex = 0;
		prevPage().click();
	}else{
		showImage(currentIndex);
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
	var content = $('<img src="'+src+'"><br><div class="fdesc"><span>'+summary+'</span><div>'+desc+'</div></div>');
	card().empty().append(content);
}

function findRelatedText(image){

	var obj = findParentWithText(image);
	if(obj.children().length>5){
		return ""; // too many elements, probably beyond the scope 
	}else{
		// remove all images from description
		return obj.html().replace(/<img[^>]+>/g,'');
	}
}

function findParentWithText(image){
	var obj = image;
	do{
		obj = obj.parent();
	}while(!obj.text().trim());
	return obj;
}
