chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // console.log('tabs.onUpdated');
    // console.log(changeInfo);
    // console.log(tab);
    if (changeInfo.title)
    if (tab.url.startsWith("https://www.youtube.com/") && (tab.status === "complete")) {
        console.log('run PauseOnEnd.js on ' + tab.url);
        chrome.tabs.executeScript(null, {file:"PauseOnEnd.js"});
    }

});

