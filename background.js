chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    // console.log('tabs.onUpdated');
    // console.log(changeInfo);
    // console.log(tab);
    if (changeInfo.title)
    if (tab.status === "complete")
    if (tab.url.startsWith("https://www.youtube.com/watch")) {
        if (tab.url.includes("list=")) {
            console.log('run PauseOnEnd.js on ' + tab.url);
            chrome.tabs.executeScript(tabId, {file:"PauseOnEnd.js"});
        }
    }

});

