import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';

const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: true
    },
  },
  
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: ['Positive', 'Negative', "Neutral"],
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: true
    }
  },
  yaxis: {
    show: true
  },
  grid: {
    show: true
  }
};

const MonthlyBarChart = () => {
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const info = theme.palette.info.light;

  const [series, setSeries] = useState([
    {
      data: [0, 0, 0]
    }
  ]);

  const [options, setOptions] = useState(barChartOptions);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8005/api/sentiments`);
        const data = response.data;

        console.log('Data from the server:', data);

        setSeries([
          {
            data: [data.positiveCount, data.negativeCount, data.neutralCount],
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: ['#D62839'],
      xaxis: {
        labels: {
          style: {
            colors: [theme.palette.secondary.main, theme.palette.secondary.main, theme.palette.secondary.main],
          },
        },
      },
      tooltip: {
        theme: 'light',
      },
    }));
  }, [theme]);

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </div>
  );
};

export default MonthlyBarChart;
