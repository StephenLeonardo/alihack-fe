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
  

  