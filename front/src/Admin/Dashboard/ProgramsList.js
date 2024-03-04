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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';

import {
    AppBar,
    Box,
    Grid,
    Stack,
    Toolbar,
    Typography
  } from '@mui/material';

  import Card from '@mui/material/Card';  // Import Card from Material-UI
import CardContent from '@mui/material/CardContent';


  const drawerWidth = 240;


  const ProgramsList = () => {
    const [programs, setPrograms] = useState([]);
    const [error, setError] = useState('')
    const [deleteError, setDeleteError] = useState('')
    const [loading, setLoading] = useState(true)
    const [isDeleted, setIsDeleted] = useState(false)

    let navigate = useNavigate()
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

        if (deleteError) {
            toast.error(deleteError, {
                position: 'bottom-right'
            });
        }

        if (isDeleted) {
            toast.success('Program deleted successfully', {
                position: 'bottom-right'
            })
            navigate('/getPrograms');
            
            setIsDeleted(false)
            setDeleteError('')

        }

    }, [error, deleteError, isDeleted,])

    const deleteProgram = async (id) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.delete(`http://localhost:8005/api/getPrograms/${id}`, config)

            setIsDeleted(data.success)
            setLoading(false)
        } catch (error) {
            setDeleteError(error.response.data.message)

        }
    }

    const programsList = () => {
        const data = {
          columns: [
            {
              label: 'ID',
              field: 'id',
              sort: 'asc',
            },
            {
              label: 'Name',
              field: 'name',
              sort: 'asc',
            },
            {
              label: 'Description',
              field: 'description',
              sort: 'asc',
            },
            {
              label: 'Image',
              field: 'images',
            },
            {
              label: 'Actions',
              field: 'actions',
            },
          ],
          rows: [],
        };
      
        if (programs) {
          programs.forEach((program) => {
            const imagesArray = program.images && Array.isArray(program.images) ? program.images : [];
      
            const defaultImageUrl = 'https://via.placeholder.com/50';
      
            const images = imagesArray.map((image, index) => (
              <img
                key={index}
                src={image.url || defaultImageUrl}
                alt={`Image ${index + 1} for ${program.name}`}
                style={{ width: '50px', height: '50px', marginRight: '5px' }}
              />
            ));
      
            data.rows.push({
              id: program._id,
              name: program.name,
              description: program.description,
              images: images.length > 0 ? images : 'No Images',
              actions: (
                <Fragment>
                  <Link to={`/getPrograms/${program._id}`} className="btn btn-primary py-1 px-2">
                    <FontAwesomeIcon icon={faPencil} />
                  </Link>
                  <button
                    className="btn btn-danger py-1 px-2 ml-2"
                    onClick={() => deleteProgramHandler(program._id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </Fragment>
              ),
            });
          });
        }
      
        return data;
      };
      
      
         
    const deleteProgramHandler = (id) => {
        deleteProgram(id)
    }

    return (
      <div className='container'>
      <div style={{overflowY: 'auto', backgroundColor: '#27292a', marginTop: '150px'}}>
       
      <Grid item xs={12} sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Typography variant="h5" textAlign="center">Program Lists</Typography>
</Grid>

          <Card>
            <CardContent>
              {loading ? <Loader /> : (
                <MDBDataTable
                  data={programsList()}
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
      </div>
    </div>
    
      );     
    };

export default ProgramsList;