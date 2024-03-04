import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './header';
import { getUser } from '../utils/helpers';
import axios from 'axios';

const SinglePrograms = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: ''
  });
  const [program, setProgram] = useState({});
  const [comment, setComment] = useState('');

  let { id } = useParams();

  const singlePrograms = async (id) => {
    let link = `http://localhost:8005/api/getSingleProgram/${id}`;
    try {
      let res = await axios.get(link);
      console.log("Program fetched:", res.data.program);
      setProgram(res.data.program);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUser();
        setUserData({
          name: user.name,
          email: user.email
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    singlePrograms(id);
    fetchUserData();
  }, [id]);

  const handleSendComment = async () => {
    try {
      const requestBody = {
        programId: id,
        text: comment
      };
      await axios.post('http://localhost:8005/api/program-sentiment', requestBody);
      setComment('');
      toast.success('Successfully added sentiment');
    } catch (error) {
      console.error('Error sending comment:', error);
      alert('Failed to send comment. Please try again later.');
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-content">
              <div className="game-details">
              {program.images && program.images.length > 0 && (
                  <div className="col-lg-4 d-flex justify-content-center align-items-center">
                    <img src={program.images[0].url} alt="Program Image" />
                  </div>
                )}

                <div className="row">
                  <div className="col-lg-12">
                    <h2>{program.name || ''}</h2>
                    <h5>{program.description || ''}</h5>
                  </div>
                  <div className="col-lg-12">
                    <div className="content">
                      <form action="#" method="post">
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="left-info">
                              <h4>Your Information</h4>
                              <span>Name:</span>
                              <input type="text" name="name" required="" value={userData.name} /><br />
                              <span>Email:</span>
                              <input type="email" name="email" required="" value={userData.email} /><br />
                              <button type="button" onClick={handleSendComment}>Submit</button>
                            </div>
                          </div>
                          <div className="col-lg-6">
                            <div className="right-info">
                              <h4>Feedback</h4>
                              <span>Comments:</span>
                              <textarea name="comments" rows="6" value={comment} onChange={(e) => setComment(e.target.value)}></textarea><br />
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SinglePrograms;
