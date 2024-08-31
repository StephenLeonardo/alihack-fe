// background.js

let storedData = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendData') {
        storedData = message.data; // Store the data
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getData') {
        sendResponse({ data: storedData }); // Send the stored data to the popup
    }
});




