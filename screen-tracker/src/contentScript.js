import FingerprintJS from '@fingerprintjs/fingerprintjs';

// document.addEventListener("DOMContentLoaded", (event) => {
const apiUrl = 'https://flask-alihack-qufcovcchv.ap-southeast-1.fcapp.run';

// contentScript.js
const pageContent = document.body.innerText; // Extracts text from the page

let isTabActive = document.visibilityState === 'visible';
let shouldHideCard = false;

// for demo purpose
let userId = "c5cfa6f6a6ea955cac39fd0531963ea2";

function injectFloatingCard(htmlContent) {
    console.log(htmlContent)

    // Create the card container
    const card = document.createElement('div');
    card.style.position = 'fixed';
    card.style.top = '20px';
    card.style.right = '20px';
    card.style.backgroundColor = '#fff';
    card.style.padding = '20px';
    card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    card.style.borderRadius = '8px';
    card.style.zIndex = '1000';
    card.style.width = '450px';

    // Create the close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;'; // Close icon
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.fontSize = '18px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#888';

    // Add close functionality
    closeButton.onclick = function() {
        card.remove();
    };

    // Add content to the card
    const cardContent = document.createElement('div');
    cardContent.innerHTML = htmlContent;

    // Append the close button and content to the card
    card.appendChild(closeButton);
    card.appendChild(cardContent);

    // Append the card to the body
    document.body.appendChild(card);
}

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
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json()
        })
        .then(data => {
            chrome.runtime.sendMessage({
                action: 'sendData',
                data: data
            });

            if (shouldHideCard) {
                return
            }
            shouldHideCard = true;
            const popupContent = `<div style="width: 100%; max-height: 500px; overflow:scroll; max-width: 28rem; margin-top: 1.5rem; padding: 1.5rem; background-color: #f3f4f6; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);">
                ${data.minutes_saved <= 0 ? '<h2 style="font-size: 1.125rem; color: #1f2937; margin-bottom: 1rem;">Summary:</h2>' : `<h2 style="font-size: 1.125rem; color: #1f2937; margin-bottom: 1rem;">Save ${data.minutes_saved} minute(s) of your time by reading this <span style="font-weight: 600;">summary</span></h2>` }
                <p style="color: #374151; font-size: 1rem;">${data.summary}</p>
              </div>`
            injectFloatingCard(popupContent)
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
}


// Function to log when the URL is opened
async function logUrlOpened(url) {
    // Store the URL in localStorage
    localStorage.setItem('activeUrl', url);

    // TODO: send to BE
    try {
        const userId = await getUserId(); // Call getUserId and wait for the result
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
    // Remove the URL from localStorage
    localStorage.removeItem('activeUrl');

    try {
        const userId = await getUserId(); // Call getUserId and wait for the result
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
        // send BE
        try {
            const userId = await getUserId(); // Call getUserId and wait for the result
            const url = window.location.href; // Current page URL
            const timestamp = Math.floor(Date.now() / 1000);
            const eventType = 'POLL'; // Example event type
            const textContent = pageContent; // Example text content

            // Call trackToBE with the obtained userId and other parameters
            trackToBE(userId, url, timestamp, eventType, textContent);
        } catch (error) {
            console.error('Error fetching user ID:', error);
        }

    }
}

setInterval(sendStatePing, 60000)

function main() {
    handleUrlChange();
}

main()