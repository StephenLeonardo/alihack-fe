// contentScript.js
console.log("Content script is running on this page");
const pageContent = document.body.innerText;  // Extracts text from the page
console.log("Page content:", pageContent);


// const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4')
//     .then(FingerprintJS => FingerprintJS.load())


// fpPromise
//     .then(fp => fp.get())
//     .then(result => {
//       // This is the visitor identifier:
//       const visitorId = result.visitorId
//       console.log(visitorId)

//     //   fetch('https://your-backend-url.com/api/endpoint', {
//     //     method: 'POST',
//     //     headers: {
//     //       'Content-Type': 'application/json',
//     //     },
//     //     body: JSON.stringify({
//     //       url: 'value1',
//     //       content: 'value2',
//     //       user_id: "temp-value" // https://fingerprintjs.github.io/fingerprintjs/
//     //     }),
//     //   })
//     //     .then(response => {
//     //       if (!response.ok) {
//     //         throw new Error('Network response was not ok');
//     //       }
//     //       return response.json();
//     //     })
//     //     .then(data => {
//     //       console.log('Data:', data);
//     //     })
//     //     .catch(error => {
//     //       console.error('There was a problem with the fetch operation:', error);
//     //     });

//     })



  
