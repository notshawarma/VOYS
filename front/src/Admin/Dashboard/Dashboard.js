import React, { Fragment, useEffect, useState } from 'react'
// import CssBaseline from '@mui/material/CssBaseline';
import MainCard from '../Components/MainCard'

import MonthlyBarChart from './MonthlyBarChart';
import OrdersTable from './OrdersTable';
import RecentSentiments from './RecentSentiments'
// import Header from '../Layout/Header';
// import SideBar from './SideBar';

import { getToken } from '../../utils/helpers';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './dashboard.css'



import {
  AppBar,
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import RecentTProgramSentiments from './RecentTProgramSentiments';
import TProgramBarChart from './TProgramBarChart';

// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

const drawerWidth = 240;

 const Dashboard = () => {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState('');
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [sentimentData, setSentimentData] = useState({
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
  });

  const handleChange = async (event) => {
    const selectedProgramId = event.target.value;
    setSelectedProgram(selectedProgramId);
      console.log('Selected Program ID:', selectedProgramId);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      };
  
      const response = await axios.get(`http://localhost:8005/api/tprogramSentiments?programId=${selectedProgramId}`, config);
           console.log('API Response:', response);

      const { data } = response;
  
      setSentimentData(data);
    } catch (error) {
      console.error('Error fetching sentiments:', error);
      // Handle the error, for example, display a toast message
      toast.error('Error fetching sentiments. Please try again.', {
        position: 'bottom-right'
      });
    }
  
  };

    const getPrograms = async () => {
      try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${getToken()}`
            }
        };

        const response = await axios.get(`http://localhost:8005/api/getPrograms`, config);
        const { data } = response;

        if (data.success) {
          setPrograms(data.programs);
        } else {
          setError(data.message);
        }
        setLoading(false);
      } catch (error) {
        setError(error.response ? error.response.data.message : 'An error occurred while fetching programs.');
        setLoading(false);
      }
    };
    useEffect(() => {
      getPrograms()

      if (error) {
          toast.error(error, {
              position: 'bottom-right'
          });
      }
  }, [error]);

  return (
    <>
    <div className='container' style={{ width: '100%', minHeight: '100vh', marginTop: '70px'}}>
        <Box
            component="main"
            sx={{ flexGrow: 1, p: 3 }}
        >
            <Toolbar />
            <Grid item xs={12} sx={{ mb: 3 }}>
            <Typography variant="h5">Dashboard</Typography>
          </Grid>

            <Grid container spacing={3} justifyContent="space-between">
                <Grid item xs={12} md={6} lg={4}>
                    <Typography variant="h5">Sentiment Distribution</Typography>
                    <MainCard sx={{ mt: 2 }} content={false}>
                        <Box sx={{ minWidth: 120, mt: 2 }}>
                            {/* <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Program</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedProgram}
                                    label="Program"
                                    onChange={handleChange}
                                >
                                    {programs.map((program) => (
                                        <MenuItem key={program._id} value={program._id}>
                                            {program.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                        </Box>

                        <Box sx={{ p: 3, pb: 0 }}>
                            <Stack spacing={2}>
                                {/* <Typography variant="h6" color="textSecondary">
                                    This Week Statistics
                                </Typography>
                                <Typography variant="h3"></Typography> */}
                            </Stack>
                        </Box>
                        <MonthlyBarChart />
                    </MainCard>
                </Grid>

                <Grid item xs={12} md={7} lg={8}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">MTICS Sentiments</Typography>
                        </Grid>
                        <Grid item />
                    </Grid>
                   
                        <RecentSentiments />
          
                </Grid>
            </Grid>

            <Grid container spacing={3} justifyContent="space-between" sx={{ mt: 3 }}>
                <Grid item xs={12} md={6} lg={4}>
                    <Typography variant="h5">Sentiment Distribution</Typography>
                    <MainCard sx={{ mt: 2 }} content={false}>
                        <Box sx={{ width: 200, mt: 2, ml: 2 }}>
                            {/* <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Program</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={selectedProgram}
                                    label="Program"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="" key="allPrograms">
                                        All Programs
                                    </MenuItem>
                                    {programs.map((program) => (
                                        <MenuItem key={program._id} value={program._id}>
                                            {program.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
                        </Box>

                        <Box sx={{ p: 3, pb: 0 }}>
                            <Stack spacing={2}>
                                {/* <Typography variant="h6" color="textSecondary">
                                    This Week Statistics
                                </Typography>
                                <Typography variant="h3"></Typography> */}
                            </Stack>
                        </Box>
                        <TProgramBarChart selectedProgram={selectedProgram} />
                    </MainCard>
                </Grid>

                <Grid item xs={12} md={7} lg={8}>
                    <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>
                            <Typography variant="h5">Program Sentiments</Typography>
                        </Grid>
                        <Grid item />
                    </Grid>
                        <RecentTProgramSentiments />
                   
                </Grid>
            </Grid>
        </Box>
    </div>
</>

    
  );
}

export default Dashboard
