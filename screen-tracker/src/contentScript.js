import FingerprintJS from '@fingerprintjs/fingerprintjs';

// document.addEventListener("DOMContentLoaded", (event) => {
  

// contentScript.js
console.log("Content script is running on this page");
const pageContent = document.body.innerText;  // Extracts text from the page
console.log("Page content:", pageContent);

let isTabActive = document.visibilityState === 'visible';




if (localStorage.getItem('userId') == null) {
  const fpPromise = FingerprintJS.load();
  fpPromise
    .then(fp => fp.get())
    .then(result => {
      // This is the visitor identifier:
      const visitorId = result.visitorId
      console.log('userId: ', visitorId)
      localStorage.setItem('userId', visitorId)

      // send to BE
      const data = { categories: ['cat1', 'cat2'], topics: ['topic1', 'topic2'], summary: "this is the summary" };
      chrome.runtime.sendMessage({ action: 'sendData', data: data });
    })
} else {
  // send to BE
  console.log(localStorage.getItem('userId'))
  const data = { categories: ['cat1', 'cat2'], topics: ['topic1', 'topic2'], summary: "this is the summary" };
  chrome.runtime.sendMessage({ action: 'sendData', data: data });
}



// Function to log when the URL is opened
function logUrlOpened(url) {
  console.log(`You have opened this URL: ${url}`);
  // Store the URL in localStorage
  localStorage.setItem('activeUrl', url);

  // TODO: send to BE
}

// Function to log when the URL is closed
function logUrlClosed(url) {
  console.log(`You have closed this URL: ${url}`);
  // Remove the URL from localStorage
  localStorage.removeItem('activeUrl');

  // TODO: send to BE
}

// Function to handle URL changes
function handleUrlChange() {
  const currentUrl = window.location.href;
  const storedUrl = localStorage.getItem('activeUrl');

  console.log(localStorage.getItem('userId'))

  // If the URL has changed
  if (storedUrl !== currentUrl) {
      // If there's a previously stored URL, log it as closed
      if (storedUrl) {
          logUrlClosed(storedUrl);
      }
      // Log the new URL as opened
      logUrlOpened(currentUrl);
  }
}

// Listen for visibility changes
document.addEventListener('visibilitychange', () => {
  isTabActive = document.visibilityState === 'visible';
  if (document.visibilityState === 'visible') {
      handleUrlChange();
  } else {
      logUrlClosed(window.location.href);
  }
});

// Listen for URL changes via back/forward navigation (history API)
window.addEventListener('popstate', handleUrlChange);

// Listen for hash changes in the URL (e.g., www.example.com/page#section)
window.addEventListener('hashchange', handleUrlChange);

// Listen for page reloads or when the user navigates away
window.addEventListener('beforeunload', () => {
  logUrlClosed(window.location.href);
});






// Function to perform the operation
function sendStatePing() {
  if (isTabActive) {
      console.log('Performing operation: Page is active.');

      // send BE

  } else {
      console.log('Skipping operation: Page is not active.');
  }
}

setInterval(sendStatePing, 60000)


// });