// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const UserSentimentsChart = () => {
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8005/api/v1/sentiments`);
//         setData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error.message);
//       }
//     };

//     fetchData();
//   }, []);

//   if (!data) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <BarChart data={[data]}>
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Bar dataKey="positiveCount" fill="#82ca9d" name="Positive" />
//         <Bar dataKey="negativeCount" fill="#ff6666" name="Negative" />
//       </BarChart>
//     </ResponsiveContainer>
//   );
// };

// export default UserSentimentsChart;

import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'Positive',
    Positive: 4000,
  },
  {
    name: 'Negative',
    Negative: 3000,
  },
];

export default class Example extends PureComponent {
  
    render() {
      return (
        <ResponsiveContainer width="100%" height="100%">
             <div style={{ maxWidth: '100%', overflow: 'auto' }}>
          <BarChart
            width={400}
            height={300}
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
            <Bar dataKey="Positive" fill="#008000" activeBar={<Rectangle fill="#006700" stroke="#006700" />} />
            <Bar dataKey="Negative" fill="#FF0000" activeBar={<Rectangle fill="#b20000" stroke="#b20000" />} />
          </BarChart>
          </div>
        </ResponsiveContainer>
      );
    }
  }