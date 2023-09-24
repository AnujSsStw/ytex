"use strict";
console.log("working");

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if ((request.msg = "start")) {
    const tabI = await chrome.tabs.create({
      url: "https://www.youtube.com/playlist?list=WL",
    });

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (changeInfo.status == "complete" && tab.active && tab.id == tabI.id) {
        chrome.tabs.sendMessage(tabId, { msg: "start" });
      }
    });
  }
});
