chrome.runtime.onInstalled.addListener(details => {
    console.log(details);
});

chrome.runtime.onStartup.addListener(() => {
    console.log("On Startup");
});

chrome.tabs.onCreated.addListener(tab => {
    console.log(tab);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    console.log(tabId, removeInfo);
});

chrome.windows.onCreated.addListener(tab => {
    console.log(tab);
});

chrome.windows.onRemoved.addListener(windowId => {
    console.log(windowId);
});
