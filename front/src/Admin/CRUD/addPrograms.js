import React, { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../utils/helpers';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import CssBaseline from '@mui/material/CssBaseline';
// //import Header from '../Layout/Header';
// // import SideBar from '../Dashboard/SideBar';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import TextField from '@mui/material/TextField';
// import TextareaAutosize from '@mui/material/TextareaAutosize';
// import Button from '@mui/material/Button';
// import AppBar from '@mui/material/AppBar';
// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';

const drawerWidth = 240;

const AddPrograms = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [program, setProgram] = useState({});

    let navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        images.forEach(image => {
            formData.append('images', image);
        });

        newProgram(formData);
    };

    const onChange = e => {
        const files = Array.from(e.target.files);
        setImagesPreview([]);
        setImages([]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result]);
                    setImages(oldArray => [...oldArray, reader.result]);
                }
            };

            reader.readAsDataURL(file);
        });
    };

    const newProgram = async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getToken()}`
                }
            };

            const { data } = await axios.post(`http://localhost:8005/api/newProgram`, formData, config);
            setSuccess(data.success);
            setProgram(data.program);
        } catch (error) {
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: 'bottom-right'
            });
        }

        if (success) {
            navigate('/getPrograms');
            toast.success('Program created successfully', {
                position: 'bottom-right'
            });
        }
    }, [error, success]);

    return (
        <>
            <div className='container'>
            <div className="main_div" style={{ width: '50%', minHeight: '550px', padding: '20px' }}>
            <div className="title" style={{ color: 'white' }}>Create New Program</div>
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
                        <div className="image-preview">
                            {imagesPreview.map((img, index) => (
                                <img src={img} key={index} alt="Images Preview" className="mt-3 mr-2" width="50" height="150" sx={{ mb: 2 }} />
                            ))}
                        </div>
                        </div>
                      
                        <div className="input_box button" style={{ marginTop: '200px' }}>
                            <input type="submit" value="CREATE" />
                        </div>
                    </form>
                </div>
            </div>
        </>


    );
};

export default AddPrograms;
