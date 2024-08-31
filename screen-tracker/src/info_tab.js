import Plotly from 'plotly.js-dist';

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

document.addEventListener("DOMContentLoaded", (e) => {
    // chrome.runtime.sendMessage({ action: 'getData' }, (response) => {
    //     if (response && response.data) {
            // Mock data for response.data.items
            const mockItems = [
                { name: "Instagram", duration: "1h 45m" },
                { name: "Facebook", duration: "1h 10m" },
                { name: "YouTube", duration: "2h 30m" },
                { name: "Twitter", duration: "45m" },
                { name: "LinkedIn", duration: "30m" },
                { name: "Instagram", duration: "1h 45m" },
                { name: "Facebook", duration: "1h 10m" },
                { name: "YouTube", duration: "2h 30m" },
                { name: "Twitter", duration: "45m" },
                { name: "LinkedIn", duration: "30m" },
                { name: "Instagram", duration: "1h 45m" },
                { name: "Facebook", duration: "1h 10m" },
                { name: "YouTube", duration: "2h 30m" },
                { name: "Twitter", duration: "45m" },
                { name: "LinkedIn", duration: "30m" },
                { name: "Instagram", duration: "1h 45m" },
                { name: "Facebook", duration: "1h 10m" },
                { name: "YouTube", duration: "2h 30m" },
                { name: "Twitter", duration: "45m" },
                { name: "LinkedIn", duration: "30m" }
            ];

            const listItems = mockItems.map(item => `
                <li class="flex justify-between p-2 hover:bg-gray-200 rounded">
                    <span>${item.name}</span>
                    <span>${item.duration}</span>
                </li>
            `).join('');

            document.getElementById('mostVisitedList').innerHTML = listItems;
            document.getElementById('categoriesList').innerHTML = listItems;
            //     }
    // });
});