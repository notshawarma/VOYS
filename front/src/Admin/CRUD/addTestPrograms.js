// import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React, { Fragment, useEffect, useState } from 'react'
import CssBaseline from '@mui/material/CssBaseline';

// import Header from '../Layout/Header';
// import SideBar from '../Dashboard/SideBar';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Button from '@mui/material/Button';

import {
  AppBar,
  Box,
  Grid,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';

const drawerWidth = 240;


const AddPrograms = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState('')
    const [program, setProgram] = useState({})

    let navigate = useNavigate()

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);
        images.forEach(image => {
            formData.append('images', image)
        })

        newProgram(formData)
    }

    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        setImages([])
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })

    }
    const newProgram = async (formData) => {

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.post(`http://localhost:8005/api/newProgram`, formData, config);
            setLoading(false)
            setSuccess(data.success)
            setProgram(data.program)
        } catch (error) {
            setError(error.response.data.message)

        }
    }
    useEffect(() => {

        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
        }

        if (success) {
            navigate('/');
            toast.success('Program created successfully', {
                position: 'bottom-right'
            });

        }

    }, [error, success,])


    return (
      <Fragment>
        <div className="row">
        <div style={{ display: 'flex' }} sx={{ bgcolor: '#f4f4f4' }}>
      {/* <SideBar /> */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ backgroundColor: '#f4f4f4', width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}>
        {/* <Header /> */}
        <Typography variant="h6" noWrap component="div">
        </Typography>
      </AppBar>
        <Toolbar />
        
        <Grid item xs={12} sx={{ mb: 5 }}>
        <Typography variant="h5" sx={{ textAlign: 'center', margin: 'auto', marginTop: '2rem' }}>
            Create New Test Program
        </Typography>

        </Grid>

        <Card sx={{ maxWidth: 700, margin: 'auto', marginTop: 5 }}>
            <CardContent >
                <div className="col-12 col-md-10" sx={{ backgroundColor: '#BA324F', padding: '16px' }}>
                    <form className="shadow-lg" onSubmit={submitHandler} encType="multipart/form-data">
                    <TextField
                        label="Program Name"
                        id="name_field"
                        className="form-control"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <TextareaAutosize
                        aria-label="Program Description"
                        placeholder="Description"
                        id="description_field"
                        rows={4} 
                        className="form-control"
                        style={{ width: '100%' }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                        <div className="form-group">
                            <label>Images</label>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    name="images"
                                    className="custom-file-input"
                                    id="customFile"
                                    onChange={onChange}
                                    multiple
                                    sx={{ mb: 2 }}
                                />
                            </div>

                            {imagesPreview.map((img) => (
                                <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" sx={{ mb: 2 }}/>
                            ))}
                        </div>

                        <Button variant="contained" type="submit" fullWidth sx={{ marginTop: '1rem' }}>
                            CREATE
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
      </Box>    
      </div>
      </div>
    </Fragment>
    )
}
export default AddPrograms
