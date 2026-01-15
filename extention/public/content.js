// Content script - extracts text from webpage
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageText") {
    const pageText = document.body.innerText;
    sendResponse({ text: pageText });
  }
});

console.log("SkillSync content script loaded");
