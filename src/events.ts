import { fetchManager } from "./WorkspaceManager/setup";

chrome.runtime.onInstalled.addListener(details => {
    console.debug("runtime.onInstalled:", details);

    fetchManager().then(_manager => {
        // Nothing to do. `fetchManager` will automatically
        // set the initial Workspace and saved it locally.
    });
});

chrome.runtime.onStartup.addListener(() => {
    console.debug("runtime.OnStartup");
});

chrome.tabs.onCreated.addListener(tab => {
    console.debug("tabs.onCreated:", tab);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    console.debug("tabs.onRemoved:", tabId, removeInfo);
});

chrome.windows.onCreated.addListener(tab => {
    console.debug("windows.onCreated:", tab);
});

chrome.windows.onRemoved.addListener(windowId => {
    console.debug("windows.onRemoved:", windowId);
});
