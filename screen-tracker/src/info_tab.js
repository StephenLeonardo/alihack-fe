import Plotly from 'plotly.js-dist';

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
