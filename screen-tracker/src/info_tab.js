import Plotly from 'plotly.js-dist';

// Data for the scatter plot
const data = [
    {
        x: [1, 4, 7],
        y: [2, 5, 8],
        z: [3, 6, 9],
        mode: 'markers+text',
        type: 'scatter3d',
        text: ['Point 1', 'Point 2', 'Point 3'],
        textposition: 'top center',
        marker: {
            size: [10, 20, 30], // Custom sizes for each marker
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

// Render the scatter plot
Plotly.newPlot('scatter-plot', data, layout);
