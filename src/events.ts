import { fetchManager } from "./WorkspaceManager/setup";

chrome.runtime.onInstalled.addListener(details => {
    console.debug("runtime.onInstalled:", details);

    fetchManager().then(_manager => {
        // Nothing to do. `fetchManager` will automatically
        // set the initial Workspace and saved it locally.
    });
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
