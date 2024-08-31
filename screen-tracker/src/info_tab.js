import Plotly from 'plotly.js-dist';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

let userId = null;
const apiUrl = 'https://flask-alihack-qufcovcchv.ap-southeast-1.fcapp.run';

const dataList = [
    { x: 1, y: 2, z: 3, label: 'Point 1' },
    { x: 4, y: 5, z: 6, label: 'Point 2' },
    { x: 7, y: 8, z: 9, label: 'Point 3' }
];

const transformedData = {
    x: dataList.map(item => item.x),
    y: dataList.map(item => item.y),
    z: dataList.map(item => item.z),
    text: dataList.map(item => item.label)
};

console.log(transformedData);

// Data for the scatter plots
const data1 = [
    {
        x: [1, 4, 7],
        y: [2, 5, 8],
        z: [3, 6, 9],
        mode: 'markers+text',
        type: 'scatter3d',
        text: ['Point 1', 'Point 2', 'Point 3'],
        textposition: 'top center',
        marker: {
            size: [10, 20, 30],
            color: ['red', 'blue', 'green']
        }
    }
];

const data2 = [
    {
        x: [10, 20, 30],
        y: [15, 25, 35],
        z: [20, 30, 40],
        mode: 'markers+text',
        type: 'scatter3d',
        text: ['Point A', 'Point B', 'Point C'],
        textposition: 'top center',
        marker: {
            size: [20, 30, 40],
            color: ['purple', 'orange', 'yellow']
        }
    }
];

// Layout configuration
const layout = {
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    },
    scene: {
        xaxis: { title: 'X Axis' },
        yaxis: { title: 'Y Axis' },
        zaxis: { title: 'Z Axis' }
    }
};

// Render the scatter plots
Plotly.newPlot('scatter-plot-1', data1, layout);
Plotly.newPlot('scatter-plot-2', data2, layout);

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

  function getWeekRangeTimestampsInSeconds() {
    const now = new Date();
  
    // Get the current day of the week (0 is Sunday, 1 is Monday, ..., 6 is Saturday)
    const currentDay = now.getDay();
  
    // Calculate the difference to Monday (if it's Sunday, go back 6 days)
    const diffToMonday = (currentDay === 0 ? -6 : 1) - currentDay;
  
    // Get the date of this week's Monday
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0); // Set to the start of the day
  
    // Get the date of this week's Sunday
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999); // Set to the end of the day
  
    // Convert to Unix timestamps (in seconds)
    const mondayTimestamp = Math.floor(monday.getTime() / 1000);
    const sundayTimestamp = Math.floor(sunday.getTime() / 1000);
  
    return { mondayTimestamp, sundayTimestamp };
  }




function aggregateTime(data) {
    if (!data) {
        return [];
    }

    const aggregateHours = data.days.reduce((acc, day) => {
        day.items.forEach(item => {
          if (!acc[item.label]) {
            acc[item.label] = 0;
          }
          acc[item.label] += item.duration_seconds; // Sum in seconds
        });
        return acc;
      }, {});
    
      // Convert seconds to "Xh Ym" format and structure the result
      const formattedTime = Object.keys(aggregateHours).map(label => {
        const totalSeconds = aggregateHours[label];
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
    
        let duration = '';
        if (hours > 0 && minutes > 0) {
          duration = `${hours}h ${minutes}m`;
        } else if (hours > 0) {
          duration = `${hours}h`;
        } else {
          duration = `${minutes}m`;
        }
    
        return { name: label, duration };
      });
    
      return formattedTime;
}

document.addEventListener("DOMContentLoaded", async (e) => {
    // chrome.runtime.sendMessage({ action: 'getData' }, (response) => {
    //     if (response && response.data) {
            // Mock data for response.data.items

            const currUserId = await getUserId();
            const {fromTime, toTime} = getWeekRangeTimestampsInSeconds();

            fetch(apiUrl + '/metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: currUserId,
                    start_time: fromTime,
                    end_time: toTime,
                    type: "CATEGORY"
                }),
            })
            .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json()
            })
            .then(data => {

                const formattedTime = aggregateTime(data)
                const listItems = formattedTime.map(item => `
                    <li class="flex justify-between p-2 hover:bg-gray-200 rounded">
                        <span>${item.name}</span>
                        <span>${item.duration}</span>
                    </li>
                `).join('');
    
                document.getElementById('mostVisitedList').innerHTML = listItems;
            })
            .catch(error => {
                console.error('Fetch Error:', error);
            });

            fetch(apiUrl + '/metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: currUserId,
                    start_time: fromTime,
                    end_time: toTime,
                    type: "DOMAIN"
                }),
            })
            .then(response => {
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json()
            })
            .then(data => {

                const formattedTime = aggregateTime(data)
                const listItems = formattedTime.map(item => `
                    <li class="flex justify-between p-2 hover:bg-gray-200 rounded">
                        <span>${item.name}</span>
                        <span>${item.duration}</span>
                    </li>
                `).join('');
    
                document.getElementById('categoriesList').innerHTML = listItems;
            })
            .catch(error => {
                console.error('Fetch Error:', error);
            });
});