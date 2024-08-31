import FingerprintJS from '@fingerprintjs/fingerprintjs';

// document.addEventListener("DOMContentLoaded", (event) => {
const apiUrl = 'https://flask-alihack-qufcovcchv.ap-southeast-1.fcapp.run';

// contentScript.js
console.log("Content script is running on this page");
const pageContent = document.body.innerText; // Extracts text from the page
console.log("Page content:", pageContent);

let isTabActive = document.visibilityState === 'visible';
let userId = null;



async function getUserId() {
  if (!userId) {
      try {
          // Load FingerprintJS
          const fp = await FingerprintJS.load();
          // Get the visitor identifier
          const result = await fp.get();
          userId = result.visitorId;
      } catch (error) {
          console.error('Error generating user ID:', error);
      }
  }
  return userId;
}

function trackToBE(userId, url, timestamp, eventType, textContent) {
    console.log('HAHHAHAHAHAHHAHA', eventType)



    fetch(apiUrl + '/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event_type: eventType,
                user_id: userId,
                text_content: textContent,
                url: url,
                timestamp: timestamp
            }),
        })
        .then(response => {
          console.log('HERE')
          console.log(response)
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json()
        })
        .then(data => {
            console.log('Data:', data);
            chrome.runtime.sendMessage({ action: 'sendData', data: data });
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}


// Function to log when the URL is opened
async function logUrlOpened(url) {
    console.log(`You have opened this URL: ${url}`);
    // Store the URL in localStorage
    localStorage.setItem('activeUrl', url);

    // TODO: send to BE
      try {
        const userId = await getUserId(); // Call getUserId and wait for the result
        console.log('logUrlOpened', userId)
        const url = window.location.href; // Current page URL
        const timestamp = Math.floor(Date.now() / 1000);
        const eventType = 'START'; // Example event type
        const textContent = pageContent; // Example text content

        // Call trackToBE with the obtained userId and other parameters
        trackToBE(userId, url, timestamp, eventType, textContent);
    } catch (error) {
        console.error('Error fetching user ID:', error);
    }
}

// Function to log when the URL is closed
async function logUrlClosed(url) {
    console.log(`You have closed this URL: ${url}`);
    // Remove the URL from localStorage
    localStorage.removeItem('activeUrl');

    try {
      const userId = await getUserId(); // Call getUserId and wait for the result
      console.log('logUrlClosed', userId)
      const url = window.location.href; // Current page URL
      const timestamp = Math.floor(Date.now() / 1000);
      const eventType = 'END'; // Example event type
      const textContent = pageContent; // Example text content
      // Call trackToBE with the obtained userId and other parameters
      trackToBE(userId, url, timestamp, eventType, textContent);
  } catch (error) {
      console.error('Error fetching user ID:', error);
  }
}

// Function to handle URL changes
function handleUrlChange() {
    const currentUrl = window.location.href;
    const storedUrl = localStorage.getItem('activeUrl');

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
async function sendStatePing() {
    if (isTabActive) {
        console.log('Performing operation: Page is active.');

        // send BE
        try {
          const userId = await getUserId(); // Call getUserId and wait for the result
          console.log('sendStatePing', userId)
          const url = window.location.href; // Current page URL
          const timestamp = Math.floor(Date.now() / 1000);
          const eventType = 'POLL'; // Example event type
          const textContent = pageContent; // Example text content
  
          // Call trackToBE with the obtained userId and other parameters
          trackToBE(userId, url, timestamp, eventType, textContent);
      } catch (error) {
          console.error('Error fetching user ID:', error);
      }

    } else {
        console.log('Skipping operation: Page is not active.');
    }
}

setInterval(sendStatePing, 60000)

function main() {
  handleUrlChange();
}

main()