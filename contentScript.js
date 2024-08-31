// contentScript.js
console.log("Content script is running on this page");
const pageContent = document.body.innerText;  // Extracts text from the page
console.log("Page content:", pageContent);
