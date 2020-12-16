# Workspace Extension

This is a Chrome Extension to bring the Workspace feature into the browser.

Workspaces are a set of windows with a list of tabs. Workspaces are useful to separate windows and tabs from different activities/projects in their own space.
This way, we can keep our browser organized and ready to resume work from where we stopped, without the need to reopen a dozen of different tabs each time.

Its development has just started! So, it'll take a while until it's ready to release.

## Building

1.  Clone repo
2.  `npm i`
3.  `npm run dev` to compile once or `npm run watch` to run the dev task in watch mode
4.  `npm run build` to build a production (minified) version

## Installation

1.  Complete the steps to build the project above
2.  Go to [_chrome://extensions_](chrome://extensions) in Google Chrome
3.  With the developer mode checkbox ticked, click **Load unpacked extension...** and select the _dist_ folder from this repo
