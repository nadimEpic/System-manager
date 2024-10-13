import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import '../style/PieChart.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/tasks');
        const data = response.data;

        const pieData = {
          labels: ['Start', 'En cours', 'Finalisé'],
          datasets: [
            {
              label: 'États',
              data: [data.start, data.encours, data.finalise],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
              ],
              borderWidth: 1,
            },
          ],
        };

        setChartData(pieData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pie-chart-container">
      <br></br>
      <h2 className="pie-chart-title">Diagramme en camembert des états des tâches</h2>
      {chartData.datasets ? <Pie data={chartData} /> : <p>Chargement des données...</p>}
    </div>
  );
};

export default PieChart;
