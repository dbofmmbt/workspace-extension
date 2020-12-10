import { fetchManager } from "./WorkspaceManager/setup";

chrome.runtime.onInstalled.addListener(details => {
    console.debug("runtime.onInstalled:", details);

    fetchManager().then(_manager => {
        // Nothing to do. `fetchManager` will automatically
        // set the initial Workspace and saved it locally.
    });
});

chrome.runtime.onStartup.addListener(() => {
    // In principle, there's nothing to do in this event, actually.
    // Let's see if it remains that way in the test phase.
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
