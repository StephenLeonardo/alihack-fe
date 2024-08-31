document.addEventListener("DOMContentLoaded", (e) => {
  chrome.runtime.sendMessage({ action: 'getData' }, (response) => {
    if (response && response.data) {
        document.getElementById('data-display').innerHTML = `
          <div class="flex flex-col items-center p-8 bg-gradient-to-r from-blue-50 to-white shadow-lg rounded-lg">
          <!-- Title section -->
          <h1 class="text-3xl font-extrabold text-gray-900 mb-6">Topics & Categories</h1>
          
          <!-- Categories section -->
          <div class="w-full max-w-md">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Categories:</h2>
            <div class="flex flex-wrap items-center justify-center space-x-2">
            ${response.data.categories.map(category => `<span class="whitespace-nowrap mb-2 bg-purple-300 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-purple-400 cursor-pointer">${category}</span>`).join('')}
            </div>
          </div>


          <!-- Topics section -->
          <div class="w-full max-w-md mb-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Topics:</h2>
            <div class="flex flex-wrap items-center justify-center space-x-2">
            ${response.data.topics.map(topic => `<span class="whitespace-nowrap mb-2 bg-red-300 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-red-400 cursor-pointer">${topic}</span>`).join('')}
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
  
  document.getElementById('openInfoTab').addEventListener('click', () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('info_tab.html')
    });
  });  
})
