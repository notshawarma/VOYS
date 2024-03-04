import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './header';
import Banner from './banner';

const Home = () => {
  const [programs, setPrograms] = useState([]);
  const [text, setText] = useState("");
  const [inputText, setInputText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const translationOptions = {
        method: 'POST',
        url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': 'ea98521173msh09acc3df674a20fp17fe08jsn7e35691b0240',
          'X-RapidAPI-Host': 'google-translate113.p.rapidapi.com'
        },
        data: new URLSearchParams({
          from: 'auto',
          to: 'en',
          text: text
        }),
      };
      const translationResponse = await axios.request(translationOptions);
  
      console.log("Translation Response:", translationResponse.data); 
  
      if (!translationResponse.data || !translationResponse.data.trans) {
        throw new Error("Translation failed");
      }
  
      const translatedText = translationResponse.data.trans;
      console.log("Translated Text:", translatedText);
      setInputText(translatedText);
  
      const sentimentOptions = {
        method: 'POST',
        url: 'https://text-analysis12.p.rapidapi.com/sentiment-analysis/api/v1.1',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'd8ca78a0demshf822ecdc63bdb3ep1ca364jsn9b5bb6bba77e',
          'X-RapidAPI-Host': 'text-analysis12.p.rapidapi.com'
        },
        data: {
          language: 'english',
          text: translatedText
        }
      };
      const sentimentResponse = await axios.request(sentimentOptions);
  
      console.log("Sentiment Response:", sentimentResponse.data); 
  
      if (!sentimentResponse.data || !sentimentResponse.data.sentiment) {
        throw new Error("Sentiment analysis failed");
      }
  
      const sentimentResult = sentimentResponse.data.sentiment;
      console.log("Sentiment Result:", sentimentResult);
      setSentiment(sentimentResult);
  
      await axios.post("http://localhost:8005/api/text-sentiment", { text: translatedText, sentiment: sentimentResult });

      // Show toast notification on successful sentiment analysis
      toast.success('Sentiment analysis added successfully!');
    } catch (error) {
      console.error("Translation and Analysis Error:", error.message);
      setError('Translation and sentiment analysis failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  const mapSentimentToCategory = (sentiment) => {
    if (sentiment === "positive") {
      return "Positive";
    } else if (sentiment === "negative") {
      return "Negative";
    } else {
      return "Neutral";
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('http://localhost:8005/api/getPrograms');
      if (!response.ok) {
        throw new Error('Failed to fetch programs');
      }
      const data = await response.json();
      setPrograms(data.programs); // Corrected from data.program to data.programs
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="page-content">
              {/* ***** Banner Start ***** */}
              <div className="main-banner">
                <div className="row">
                  <div className="col-lg-7">
                    <div className="header-text">
                      <h6>Welcome To VOYS</h6>
                      <h4>
                        <em>VOICE</em> Out your opinions
                      </h4>
                      <div className="main-button">
                        <input
                          type="text"
                          placeholder="ENTER YOUR SENTIMENT"
                          onChange={(event) => setText(event.target.value)}
                          value={text}
                          className="input"
                        />
                        <button
                          type="button"
                          className="btn"
                          onClick={fetchData}
                        >
                          Analyze
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {isLoading ? (
                <div className="data">
                  <h4>Loading…</h4>
                </div>
              ) : error ? (
                <div className="data">
                  <p>Error: {error}</p>
                </div>
              ) : (
                sentiment && (
                  <div className="thank-you-card">
                    <h4>Thank you for {mapSentimentToCategory(sentiment)} Review!</h4>
                    <p>It would help us improve.</p>
                  </div>
                )
              )}
              </div>
              {/* ***** Banner End ***** */}
              {programs.length > 0 && <Banner programs={programs} />}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
