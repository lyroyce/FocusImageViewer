
$(document.body).keydown(function(event){
	// on F2 pressed
	if(event.keyCode==113){
		if(!initialized()) sendRequest('status', true);
		else sendRequest('toogle');
	}
	// on ESC pressed
	else if(event.keyCode==27){sendRequest('status', false);}
});

function sendRequest(command, param){
	var request = {};
	if(param==undefined) param = true;
	request[command] = param;
	chrome.extension.sendRequest(request, onCommandReceive);
}

function onCommandReceive(request) {
	var show = request['status'];
	toggleDisplay(show);
}

function toggleDisplay(show){
	if(!show && !initialized()) return;
	else{
		root().toggle(show);
		if(show) content().focus();
	}
}

function initialized(){
	return $('.froot').length>0;
}

function root(){
	var element = $('.froot');
	if(element.length===0){
		element = $('<div class="froot"></div>').appendTo($(document.body));
		content();
		setup_event();
	}
	return element;
}

function content(){
	var element = $('.fcontent');
	if(element.length===0){
		var content_mask = $('<div class="fcontent-mask"></div>').appendTo(root());
		content_mask.fadeTo('fast',0.9);
		element = $('<div class="fcontent" tabindex="1"></div>').appendTo(root());
		card();
		menu();
		help();
		loadImages();
	}
	return element;
}

function setup_event(){
	var nextBtn = null;
	root().mousemove(function(e){
		var separator = $(window).width()/2;
		if(e.pageX>=separator && nextBtn !== true){
			nextButton().fadeTo('fast', 1);
			prevButton().fadeTo('fast', 0.1);
			nextBtn=true;
		}else if(e.pageX<separator && nextBtn !== false){
			prevButton().fadeTo('fast', 1);
			nextButton().fadeTo('fast', 0.1);
			nextBtn=false;
		}
	});
	var isClick = false;
	root().mousedown(function(event){
		isClick = true;
		setTimeout(function(){isClick=false;}, 200);
	});
	root().mouseup(function(event){
		if(isClick && event.which!==3){
			var separator = $(window).width()/2;
			if(event.pageX>separator) nextImage();
			else prevImage();
		}
		clearSelection();
	});
	root().keydown(function(event){
		if(!event.ctrlKey){	
			switch(event.keyCode){
				case 37:
				case 38:
					prevImage();
					event.stopPropagation();
					break;
				case 39:
				case 40:
					nextImage();
					event.stopPropagation();
					break;
			}
		}
	});
}

function clearSelection(){
	if (window.getSelection)
        window.getSelection().removeAllRanges();
    else if (document.selection)
        document.selection.empty();
}

function card(){
	var element = $('.fcard-content');
	if(element.length===0){
		var wrapper = $('<div class="fcard"></div>').appendTo(content());
		element = $('<div class="fcard-content">'+chrome.i18n.getMessage("noImage")+'</div>').appendTo(wrapper);
	}
	return element;
}

function menu(){
	var element = $('.fmenu');
	if(element.length===0){
		var menudiv_mask = $('<div class="fmenu-mask"></div>').appendTo(content());
		element = $('<div class="fmenu"></div>').appendTo(content());
		prevButton().fadeTo('fast', 0.3);
		pagination();
		nextButton().fadeTo('fast', 0.3);
		element.hover(
			function() {menudiv_mask.fadeTo('fast',0.5);},
			function() {menudiv_mask.fadeTo('fast',0.1);}
		);
		element.mousedown(function(event){
			event.stopPropagation();
		});
	}
	return element;
}

function prevButton(){
	var element = $('.fprev');
	if(element.length===0){
		element = $('<div class="fprev"><a href="#" title="'+chrome.i18n.getMessage("prevImage")+'"><b><</b></a></div>')
			.fadeTo('fast', 0.1).appendTo(menu());
		element.click(function(event){
			prevImage();
		});
	}
	return element;
}

function nextButton(){
	var element = $('.fnext');
	if(element.length===0){
		element = $('<div class="fnext"><a href="#" title="'+chrome.i18n.getMessage("nextImage")+'"><b>></b></a></div>')
			.appendTo(menu());
		element.click(function(event){
			nextImage();
		});
	}
	return element;
}

function pagination(){
	var element = $('.fpagination');
	if(element.length===0){
		var element = $('<div class="fpagination">').appendTo(menu());
		element.append(prevPage());
		element.append($('<span> | </span>'));
		element.append(nextPage());
	}
	return element;
}

function prevPage(){
	var element = $('.fprevpage');
	if(element.length===0){
		element = findAndCloneFirstLink(["上页","上一页","<上一页","<"]);
		if(element) element.removeAttr('class');
		else element = $('<a></a>').fadeTo('fast', 0);
		element.addClass('fprevpage').text(chrome.i18n.getMessage("prevPage"));
	}
	return element;
}

function nextPage(){
	var element = $('.fnextpage');
	if(element.length===0){
		element = findAndCloneFirstLink(["下页","下一页","下一页>",">"]);
		if(element) element.removeAttr('class');
		else element = $('<a></a>').fadeTo('fast', 0);
		element.addClass('fnextpage').text(chrome.i18n.getMessage("nextPage"));
	}
	return element;
}

function findAndCloneFirstLink(candidates){
	for (var i = 0; i < candidates.length; i++) {
		var elements = $('a[href!="#"]:contains("'+candidates[i]+'")');
		for (var j = 0; j < elements.length; j++) {
			// only the first visible one count
			if($(elements[j]).is(':visible')){
				return $(elements[j]).clone();
			} 
		}
	};
	return null;
}

function help(){
	var element = $('.help');
	if(element.length===0){
		var usage = chrome.i18n.getMessage("usage");
		var usagediv = $('<div class="fusage"><pre>'+usage+'</pre></div>').hide().appendTo(content());
		var extName = chrome.i18n.getMessage("extName");
		element = $('<div class="fhelp"><a href="#" title="'+extName+'"><b>?</b></a></div>').fadeTo('fast', 0.3).appendTo(content());
		element.hover(
			function() {element.fadeTo('fast',1);usagediv.show()},
			function() {element.fadeTo('fast',0.3);usagediv.hide()}
		);
		element.mousedown(function(event){
			event.stopPropagation();
		});
	}
	return element;
}

chrome.extension.onRequest.addListener(onCommandReceive); //passive
sendRequest('query'); // query status on page refresh