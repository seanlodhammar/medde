import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,);

const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
        text: '',
      },
    
    },
  };

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  
const data = {
    labels,
    datasets: [
      {
        label: 'Customers',
        data: labels.map(() => Math.random() % 20),
        borderColor: '#AA4FE1',
        backgroundColor: '#AA4FE1',
      }
    ],
  };

const LineChart = () => {



    return (
        <Line options={options} data={data}  />
    )
};

export default LineChart;