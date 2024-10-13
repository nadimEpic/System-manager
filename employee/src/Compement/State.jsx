import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const ProjectStatsChart = ({ projectId }) => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:3000/auth/stats/${projectId}`)
            .then(response => setStats(response.data))
            .catch(error => console.error('Error fetching project stats:', error));
    }, [projectId]);

    if (!stats) {
        return <div>Loading...</div>;
    }

    const data = {
        labels: ['Total Hours', 'Total Tasks'],
        datasets: [{
            label: 'Project Stats',
            data: [stats.totalHours, stats.totalTasks],
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
            borderWidth: 1
        }]
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div>
            <h4>{stats.name} - Project Stats</h4>
            <Bar data={data} options={options} />
        </div>
    );
};

export default ProjectStatsChart;
