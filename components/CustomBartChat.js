// components/CustomBarChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const data = [
  { name: 'Monday', visits: 4000 },
  { name: 'Tuesday', visits: 3000 },
  { name: 'Wednesday', visits: 2000 },
  { name: 'Thursday', visits: 2780 },
  { name: 'Friday', visits: 1890 },
  { name: 'Saturday', visits: 2390 },
  { name: 'Sunday', visits: 3490 },
];

// Define a list of colors for the bars
const colors = ['#8884d8', '#82ca9d', '#ffc658', '#FF8042', '#AF19FF', '#FF0000', '#00C49F'];

const CustomBarChart = () => {
  return (
    // Recharts recommends wrapping charts in a container for responsiveness
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="visits">
          {/* Map through data to assign a unique color to each Cell */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CustomBarChart;
