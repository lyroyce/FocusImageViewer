// remember the status for tab refresh
var tabStatusMap = {};
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        var tabId = sender.tab.id;
        // alert(JSON.stringify(request));
        if (request['status']!=undefined) {    // remember status if it's defined
            tabStatusMap[tabId]=request['status'];
            sendResponse({'status': tabStatusMap[tabId]});
        }else if (request['query']){    // return current status
        	var tabStatus = tabStatusMap[tabId]==undefined?false:tabStatusMap[tabId];
            sendResponse({'status': tabStatus});
        }else if (request['toogle']){    // return toogled status
            var newStatus = toogleStatus(tabId);
            sendResponse({'status': newStatus});
        }
    });

// toogle plugin on icon clicking
chrome.browserAction.onClicked.addListener(
    function(tab) {
        var newStatus = toogleStatus(tab.id);
        chrome.tabs.sendRequest(tab.id,
            {'status': newStatus});
    });

function toogleStatus(tabId){
    if(tabStatusMap[tabId]==undefined)newStatus=true;
    else newStatus = !tabStatusMap[tabId];
    tabStatusMap[tabId] = newStatus;
    return newStatus;
}