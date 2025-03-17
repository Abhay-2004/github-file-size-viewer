// background.js

// When the extension is installed, check if the token exists
// If not, open the popup page (as a first-run experience)
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get("githubToken", (result) => {
      if (!result.githubToken) {
        chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
      }
    });
  });