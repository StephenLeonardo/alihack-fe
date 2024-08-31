// 'use strict';

// import './popup.css';

// (function () {
//   // We will make use of Storage API to get and store `count` value
//   // More information on Storage API can we found at
//   // https://developer.chrome.com/extensions/storage

//   // To get storage access, we have to mention it in `permissions` property of manifest.json file
//   // More information on Permissions can we found at
//   // https://developer.chrome.com/extensions/declare_permissions
//   const counterStorage = {
//     get: (cb) => {
//       chrome.storage.sync.get(['count'], (result) => {
//         cb(result.count);
//       });
//     },
//     set: (value, cb) => {
//       chrome.storage.sync.set(
//         {
//           count: value,
//         },
//         () => {
//           cb();
//         }
//       );
//     },
//   };

//   function setupCounter(initialValue = 0) {
//     document.getElementById('counter').innerHTML = initialValue;

//     document.getElementById('incrementBtn').addEventListener('click', () => {
//       updateCounter({
//         type: 'INCREMENT',
//       });
//     });

//     document.getElementById('decrementBtn').addEventListener('click', () => {
//       updateCounter({
//         type: 'DECREMENT',
//       });
//     });
//   }

//   function updateCounter({ type }) {
//     counterStorage.get((count) => {
//       let newCount;

//       if (type === 'INCREMENT') {
//         newCount = count + 1;
//       } else if (type === 'DECREMENT') {
//         newCount = count - 1;
//       } else {
//         newCount = count;
//       }

//       counterStorage.set(newCount, () => {
//         document.getElementById('counter').innerHTML = newCount;

//         // Communicate with content script of
//         // active tab by sending a message
//         chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//           const tab = tabs[0];

//           chrome.tabs.sendMessage(
//             tab.id,
//             {
//               type: 'COUNT',
//               payload: {
//                 count: newCount,
//               },
//             },
//             (response) => {
//               console.log('Current count value passed to contentScript file');
//             }
//           );
//         });
//       });
//     });
//   }

//   function restoreCounter() {
//     // Restore count value
//     counterStorage.get((count) => {
//       if (typeof count === 'undefined') {
//         // Set counter value as 0
//         counterStorage.set(0, () => {
//           setupCounter(0);
//         });
//       } else {
//         setupCounter(count);
//       }
//     });
//   }

//   document.addEventListener('DOMContentLoaded', restoreCounter);

//   // Communicate with background file by sending a message
//   chrome.runtime.sendMessage(
//     {
//       type: 'GREETINGS',
//       payload: {
//         message: 'Hello, my name is Pop. I am from Popup.',
//       },
//     },
//     (response) => {
//       console.log(response.message);
//     }
//   );
// })();

// popup.js

chrome.runtime.sendMessage({ action: 'getData' }, (response) => {
  if (response && response.data) {
      document.getElementById('data-display').innerHTML = `
        <div class="flex flex-col items-center p-8 bg-gradient-to-r from-blue-50 to-white shadow-lg rounded-lg">
        <!-- Title section -->
        <h1 class="text-3xl font-extrabold text-gray-900 mb-6">Topics & Categories</h1>
        
        <!-- Topics section -->
        <div class="w-full max-w-md mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Topics:</h2>
          <div class="grid grid-cols-2 gap-4">
          ${response.data.topics.map(topic => `<div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
              <h3 class="text-lg font-bold text-gray-800">${topic}</h3>
            </div>`).join('')}
          </div>
        </div>

        <!-- Categories section -->
        <div class="w-full max-w-md">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Categories:</h2>
          <div class="space-y-4">
            ${response.data.categories.map(category => `<div class="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow duration-300">
              <h3 class="text-lg font-bold text-gray-800">${category}</h3>
            </div>`).join('')}  
          </div>
        </div>

        <!-- Summary section -->
        <div class="w-full max-w-md mt-6 p-6 bg-gray-100 rounded-lg shadow-lg">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Summary:</h2>
          <p class="text-gray-700 text-base">${response.data.summary}</p>
        </div>
      </div>
      `;
  }
});
