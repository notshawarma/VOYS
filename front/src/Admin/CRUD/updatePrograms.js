// import React, { Fragment, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const UpdateProgram = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [oldImages, setOldImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [error, setError] = useState('')
    const [program, setProgram] = useState({})
    const [loading, setLoading] = useState(true)
    const [updateError, setUpdateError] = useState('')
    const [isUpdated, setIsUpdated] = useState(false)

    let { id } = useParams();
    let navigate = useNavigate();

    const errMsg = (message = '') => toast.error(message, {
        position: 'bottom-right'
    });
    const successMsg = (message = '') => toast.success(message, {
        position: 'bottom-right'
    });

    const getSingleProgram =  async (id) => {
        try {
           const { data } = await axios.get(`http://localhost:8005/api/getSingleProgram/${id}`)
           setProgram(data.program)
           setLoading(false)
           
        } catch (error) {
            setError(error.response.data.message)
            
        }
    }
      
    const updateProgram = async (id, programData)  => {
        try {
           
            const config = {
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${getToken()}`
                }
            }
            const { data } = await axios.put(`http://localhost:8005/api/getPrograms/${id}`, programData, config)
            setIsUpdated(data.success)
           
        } catch (error) {
            setUpdateError(error.response.data.message)
            
        }
    }
    useEffect(() => {
        if (program && program._id !== id) {
            getSingleProgram(id)
        } else {
            setName(program.name);
            setDescription(program.description);
            setOldImages(program.images)
        }
        if (error) {
            errMsg(error)
            
        }
        if (updateError) {
            errMsg(updateError);
           
        }
        if (isUpdated) {
            navigate('/getPrograms');
            successMsg('Program updated successfully');
           
        }
    }, [error, isUpdated, updateError, program, id])

    const submitHandler = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.set('name', name);
        formData.set('description', description);
        images.forEach(image => {
            formData.append('images', image)
        })
        updateProgram(program._id, formData)
    }
    const onChange = e => {
        const files = Array.from(e.target.files)
        setImagesPreview([]);
        setImages([])
        setOldImages([])
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
    return (
        <>
            <div className='container'>
            <div className="main_div" style={{ width: '50%', minHeight: '550px', padding: '20px' }}>
            <div className="title" style={{ color: 'white' }}>Update Program</div>
                    <form className="shadow-lg" onSubmit={submitHandler} encType="multipart/form-data">
                    <label style={{ color: 'white', fontSize: '14px' }}>Program Name </label>
                        <div className="input_box">
                            <input type="text" placeholder="Program Name" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <label style={{ color: 'white', fontSize: '14px' }}>Description</label>
                        <div className="input_box">
                            <input type="text" placeholder="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                        </div>
                        <div className="input_box">
                        <label style={{ color: 'white', fontSize: '14px' }}>Images</label>
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

                                        {/* {imagesPreview.map((img) => (
                                            <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" sx={{ mb: 2 }}/>
                                        ))} */}
                                        {oldImages && oldImages.map(img => (
                                                    <img key={img} src={img.url} alt={img.url} className="mt-3 mr-2" width="55" height="150" />
                                                ))}
                                                {imagesPreview.map(img => (
                                                    <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="150" />
                                                ))}
                        </div>
                      
                        <div className="input_box button" style={{ marginTop: '200px' }}>
                            <input type="submit" value="UPDATE" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateProgram