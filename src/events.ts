chrome.runtime.onInstalled.addListener(details => {
    console.debug(details);
});

chrome.tabs.onCreated.addListener(tab => {
    console.debug(tab);
});

chrome.tabs.onRemoved.addListener((tab_id, remove_info) => {
    console.debug(tab_id, remove_info);
});

chrome.windows.onCreated.addListener(tab => {
    console.debug(tab);
});

chrome.windows.onRemoved.addListener(window_id => {
    console.debug(window_id);
});
