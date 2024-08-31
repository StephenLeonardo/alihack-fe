// 'use strict';

// // With background scripts you can communicate with popup
// // and contentScript files.
// // For more information on background script,
// // See https://developer.chrome.com/extensions/background_pages

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.type === 'GREETINGS') {
//     const message = `Hi ${
//       sender.tab ? 'Con' : 'Pop'
//     }, my name is Bac. I am from Background. It's great to hear from you.`;

//     // Log message coming from the `request` parameter
//     console.log(request.payload.message);
//     // Send a response message
//     sendResponse({
//       message,
//     });
//   }
// });


// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
//     // Check if the page is fully loaded
//     if (changeInfo.status === 'complete') {
//       // Inject the content script to scrape the page content
//       chrome.scripting.executeScript({
//         target: { tabId: tabId },
//         function: scrapeContent
//       }, (results) => {
//         if (results && results[0]) {
//           // Process the scraped content (e.g., send to server, save, or display)
//         }
//       });
//     }
//   });
  

  