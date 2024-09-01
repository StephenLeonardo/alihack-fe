import Plotly from 'plotly.js-dist';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// for demo purpose
let userId = "c5cfa6f6a6ea955cac39fd0531963ea2";
const apiUrl = 'https://flask-alihack-qufcovcchv.ap-southeast-1.fcapp.run';

function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let timeString = '';
    if (hours > 0) {
        timeString += `${hours} h `;
    }
    if (minutes > 0 || hours > 0) { // Display minutes if there's any hours or minutes
        timeString += `${minutes} min`;
    }
    if (minutes == 0) {
        return "< 1 min"
    }

    return timeString.trim();
}

function transformToBarData(data) {
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const labels = {}; // Object to store data by label

    data.days.forEach((dayData, index) => {
        const idx = index

        dayData.items.forEach(item => {
            const label = item.label;
            const duration = item.duration_seconds;

            // Initialize the label in the object if not already present
            if (!labels[label]) {
                labels[label] = {
                    x: weekDays.slice(),
                    y: Array(weekDays.length).fill(-1)
                };
            }

            // Find the index of the current day
            labels[label].y[idx] += duration;
        });
    });

    // Convert the labels object into the desired array format
    const items = Object.keys(labels).map(label => ({
        x: labels[label].x,
        y: labels[label].y.map(y => {
            if (y == -1) return 0;
            return Math.floor(y / 60) > 0 ? Math.floor(y / 60) : 1
        }),
        text: labels[label].y.map(y => secondsToTime(y)),
        name: label,
        type: 'bar',
    }));

    return items;
}

// Layout configuration
const domainBarLayout = {
    xaxis: {
        title: ''
    },
    yaxis: {
        title: 'Minutes'
    },
    barmode: 'relative',
    title: 'Websites',
    barcornerradius: 5
};

const categoryBarLayout = {
    xaxis: {
        title: ''
    },
    yaxis: {
        title: 'Minutes'
    },
    barmode: 'relative',
    title: 'Categories',
    barcornerradius: 5
};

const scatterPlotLayout = {
    margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    },
    scene: {
        xaxis: {
            title: 'X Axis'
        },
        yaxis: {
            title: 'Y Axis'
        },
        zaxis: {
            title: 'Z Axis'
        }
    }
};

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
    const sundayTimestamp = Math.floor(sunday.getTime() / 1000) + 1;

    return {
        mondayTimestamp,
        sundayTimestamp
    };
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
        } else if (minutes > 0) {
            duration = `${minutes}m`;
        } else {
            duration = '< 1m'
        }


        return {
            name: label,
            duration,
            duration_seconds: totalSeconds
        };
    });

    formattedTime.sort((a, b) => b.duration_seconds - a.duration_seconds);

    return formattedTime;
}

document.addEventListener("DOMContentLoaded", async (e) => {
    const currUserId = await getUserId();
    const {
        mondayTimestamp,
        sundayTimestamp
    } = getWeekRangeTimestampsInSeconds();

    fetch(apiUrl + '/metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: currUserId,
                start_time: mondayTimestamp,
                end_time: sundayTimestamp,
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
                    <div class="flex justify-between items-center p-4 border border-gray-200">
                    <div class="flex items-center">
                        <span class="text-sm">${item.name}</span>
                    </div>
                    <span class="text-sm">${item.duration}</span>
                </div>
                `).join('');

            document.getElementById('categoriesList').innerHTML = listItems;

            const barData = transformToBarData(data);
            Plotly.newPlot('scatter-plot-2', barData, categoryBarLayout);
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
                start_time: mondayTimestamp,
                end_time: sundayTimestamp,
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
                <div class="flex justify-between items-center p-4 border border-gray-200">
                    <div class="flex items-center">
                        <img src="https://icons.duckduckgo.com/ip2/${item.name}.ico" alt="Description" class="w-8 h-8 mr-2">
                        <span class="text-sm">${item.name}</span>
                    </div>
                    <span class="text-sm">${item.duration}</span>
                </div>
                `).join('');

            document.getElementById('mostVisitedList').innerHTML = listItems;

            const barData = transformToBarData(data);
            Plotly.newPlot('scatter-plot-1', barData, domainBarLayout);
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });

    var now = new Date();
    var startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);


    fetch(apiUrl + '/metrics/topics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: currUserId,
                start_time: startOfDay / 1000,
                end_time: startOfTomorrow / 1000
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json()
        })
        .then(data => {       
            const minSize = 5;
            const maxSize = 20;
            // const sizeScaled = data.points.map(s => Math.max(minSize, Math.min(maxSize, s * 10)));

            
            const transformedData = {
                x: data.points.map(item => item.x),
                y: data.points.map(item => item.y),
                z: data.points.map(item => item.z),
                text: data.points.map(item => item.label),
                textposition: 'top center', // Position of the text relative to markers
                mode: 'markers+text', // Show both markers and text
                type: 'scatter3d',
                marker: {
                    size: minSize,
                    colorscale: 'Viridis',
                    opacity: 0.8
                }
            };

            console.log(transformedData)

            Plotly.newPlot('scatterPlot3D', [transformedData], scatterPlotLayout);
        })
        .catch(error => {
            console.error('Fetch Error:', error);
        });
});