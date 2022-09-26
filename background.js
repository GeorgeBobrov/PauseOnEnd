var idDefaultState = 'DefaultState';

chrome.runtime.onInstalled.addListener(function(details) {
	chrome.storage.local.get([idDefaultState], function(data) {
		var DefaultState = data[idDefaultState] || false;

        chrome.contextMenus.create({
            id: "PauseOnEnd",
            title: "PauseOnEnd Default on/off",
            type: "checkbox",
            checked: DefaultState
        }, function() {
            console.log("contextMenus.create", chrome.runtime.lastError);
        });
	});

});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    chrome.storage.local.set({ [idDefaultState]: info.checked }, function() {
        console.info('PauseOnEnd: info.checked ' + info.checked);
        // chrome.tabs.executeScript(null, {file:"PauseOnEnd.js"});
    });

}); 

// Log all items in chrome.storage.local for this extension
// chrome.storage.local.get(null, function (Items) {console.log(Items)});