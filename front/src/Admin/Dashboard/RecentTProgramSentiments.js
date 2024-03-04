import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'
import 'mdbreact/dist/css/mdb.css';

import Loader from '../../Layout/Loader'
// import Sidebar from './SideBar'
import { getToken } from '../../utils/helpers';
import axios from 'axios'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// import SideBar from '../Dashboard/SideBar'
// import Header from '../Layout/Header'
import CssBaseline from '@mui/material/CssBaseline';

import '@fortawesome/fontawesome-free/css/all.css';
import MainCard from '../Components/MainCard'


import {
    AppBar,
    Box,
    Grid,
    Stack,
    Toolbar,
    Typography
  } from '@mui/material';

  import Card from '@mui/material/Card';  
  import CardContent from '@mui/material/CardContent';


  const drawerWidth = 240;


  const RecentTProgramSentiments = () => {
    const [sentiments, setSentiments] = useState([]);
    const [programs, setPrograms] = useState({});
    const [error, setError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDeleted, setIsDeleted] = useState(false);

    let navigate = useNavigate();

    const getPrograms = async () => {
      try {
          const response = await axios.get(`http://localhost:8005/api/getPrograms`);
          const { data } = response;

          if (data.success) {
              const programMap = {};
              data.programs.forEach((program) => {
                  programMap[program._id] = program.name;
              });
              setPrograms(programMap);
          } else {
              setError(data.message);
          }
      } catch (error) {
          setError('An error occurred while fetching programs.');
      }
      };

    const getRecentSentiments = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };
    
            const response = await axios.get(`http://localhost:8005/api/getRecent`, config);
            const { data } = response;
    
            if (data.success) {
                setSentiments(data.sentiments);
            } else {
                setError(data.message);
            }
    
            setLoading(false);
        } catch (error) {
            setError(error.response ? error.response.data.message : 'An error occurred while fetching sentiments.');
            setLoading(false);
        }
    };
    useEffect(() => {
        getPrograms();
        getRecentSentiments()

        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
        }

        if (deleteError) {
            toast.error(deleteError, {
                position: 'bottom-right'
            });
        }

    }, [error, deleteError, 
    ])

    const sentimentsList = () => {
      const data = {
          columns: [
              {
                  label: 'ID',
                  field: 'id',
                  sort: 'asc',
              },
              {
                  label: 'Program Name',
                  field: 'name',
                  sort: 'asc',
              },
              {
                  label: 'Text',
                  field: 'text',
                  sort: 'asc',
              },
              {
                  label: 'Sentiment',
                  field: 'sentiment',
                  sort: 'asc',
              },
          ],
          rows: [],
      };
      
      if (sentiments) {
        sentiments.forEach((sentiment) => {
            data.rows.push({
                id: sentiment._id,
                name: programs[sentiment.program], 
                text: sentiment.text,
                sentiment: sentiment.sentiment,
            });
        });
    }

    return data;
};
      
    return (
        <div className='container'>
        <div style={{ height: '452px', overflowY: 'auto' }} sx={{ bgcolor: '#27292a' }}>
        <Toolbar />
        <Box style={{ padding: '16px', borderRadius: '4px', marginTop: '-3.50rem' }}>
        <Card>
            <CardContent>
            {loading ? <Loader /> : (
                <MDBDataTable
                data={sentimentsList()}
                bordered
                striped
                hover
                responsive
                displayEntries={false}
                entriesLabel=""
                paginationLabel={['Previous', 'Next']}
                />
            )}
            </CardContent>
        </Card>
        </Box>
        </div>
        </div>

  );       
    };

export default RecentTProgramSentiments