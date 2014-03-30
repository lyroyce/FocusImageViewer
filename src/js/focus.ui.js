
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
		menu();
		setupEvent();
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
		status();
		toolbar();
		loadImages();
	}
	return element;
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
		var menudiv_mask = $('<div class="fmenu-mask"></div>').fadeTo('fast',0.1).appendTo(root());
		// fadeTo should be called after the div is appended here to prevent a incorrect style: "display: block"
		element = $('<div class="fmenu"></div>').appendTo(root()).fadeTo('fast',0.8);
		prevButton();
		pagination();
		nextButton();
		element.hover(
			function() {menudiv_mask.fadeTo('fast',0.7); pagination().fadeTo('fast', 1);},
			function() {menudiv_mask.fadeTo('fast',0.3); pagination().fadeTo('fast', 0.1);}
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
		element = $('<div class="fprev" title="'+chrome.i18n.getMessage("prevImage")+'"><b><</b></div>')
			.appendTo(menu());
		element.click(function(event){
			prevImage();
		});
	}
	return element;
}

function nextButton(){
	var element = $('.fnext');
	if(element.length===0){
		element = $('<div class="fnext" title="'+chrome.i18n.getMessage("nextImage")+'"><b>></b></div>')
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
		var prevPage = prevPageButton();
		var nextPage = nextPageButton();
		element.append(prevPage);
		element.append('<span>   </span>');
		element.append(nextPage);
		element.fadeTo('fast', 0.1);
	}
	return element;
}

function prevPageButton(){
	var element = $('.fprevpage');
	if(element.length===0){
		element = findAndCloneFirstLink(["上页","上一页","<上一页","<","Previous"]);
		if(element) element.removeAttr('class');
		else element = $('<span></span>').fadeTo('fast', 0); // placeholder
		element.addClass('fprevpage').text(chrome.i18n.getMessage("prevPage"));
	}
	return element;
}

function nextPageButton(){
	var element = $('.fnextpage');
	if(element.length===0){
		element = findAndCloneFirstLink(["下页","下一页","下一页>",">","Next"]);
		if(element) element.removeAttr('class');
		else element = $('<span></span>').fadeTo('fast', 0); // placeholder
		element.addClass('fnextpage').text(chrome.i18n.getMessage("nextPage"));
	}
	return element;
}

function findAndCloneFirstLink(candidates){
	for (var i = 0; i < candidates.length; i++) {
		var elements = $('a[href!="#"]:contains("'+candidates[i]+'")').map(function(){ 
			if ($(this).text() == candidates[i]) return this; 
		});
		for (var j = 0; j < elements.length; j++) {
			// only the first visible one count
			if($(elements[j]).is(':visible')){
				return $(elements[j]).clone();
			} 
		}
	};
	return null;
}

function toolbar(){
	var element = $('.ftoolbar');
	if(element.length===0){
		element = $('<div class="ftoolbar">').appendTo(content());
		element.mousedown(function(event){
			event.stopPropagation(); // do not go to next image
		});
		close();
		help();
	}
	return element;
}

function help(){
	var element = $('.fhelp');
	if(element.length===0){
		var usage = chrome.i18n.getMessage("usage");
		var usagediv = $('<div class="fusage"><pre>'+usage+'</pre></div>').hide().appendTo(content());
		element = $('<div class="fhelp"><b>?</b></div>').fadeTo('fast', 0.3).appendTo(toolbar());
		element.hover(
			function() {element.fadeTo('fast',1);usagediv.show()},
			function() {element.fadeTo('fast',0.3);usagediv.hide()}
		);
	}
	return element;
}

function close(){
	var element = $('.fclose');
	if(element.length===0){
		var title = chrome.i18n.getMessage("close");
		element = $('<div class="fclose" title="'+title+'"><b>X</b></div>').fadeTo('fast', 0.3).appendTo(toolbar());
		element.hover(
			function() {element.fadeTo('fast',1);},
			function() {element.fadeTo('fast',0.3);}
		);
		element.click(function(event){
			sendRequest('status', false);
		});
	}
	return element;
}

function status(){
	var element = $('.fstatus');
	if(element.length===0){
		element = $('<div class="fstatus"></div>').appendTo(root());
	}
	return element;
}
chrome.extension.onRequest.addListener(onCommandReceive); //passive
sendRequest('query'); // query status on page refresh