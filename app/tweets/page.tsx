"use client"
import React, { useTransition, useState, useEffect } from 'react';
import GradientGauge from './GradientGauge';

const MessageFetcher = () => {
  const [messages, setMessages] = useState([]);
  const [totalSentiment, setTotalSentiment] = useState<number>(0);
  const [sentimentCount, setSentimentCount] = useState<number>(0);
  const [avgSentiment, setAvgSentiment] = useState<number>(0);

  useEffect(() => {
    setAvgSentiment( totalSentiment / sentimentCount);
  }, [totalSentiment])

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        // GET request to first API endpoint
        const response = await fetch('http://localhost:8000/api/tweet');
        const data = await response.json();
        
        // Update messages state
        setMessages(prevMessages => [ data.message, ...prevMessages]);
        
        // POST request to second API endpoint
        const postResponse = await fetch('http://localhost:8000/api/tweet-sentiment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: data.message }),
        });
        
        // You can handle the response from the POST request here if needed
        const postData = await postResponse.json();
        setSentimentCount(count => count + 1)
        setTotalSentiment(total => total + Number(postData.sentiment));


      } catch (error) {
        console.error('Error fetching or posting message:', error);
      }
    };

    // Fetch message every 10 seconds
    const intervalId = setInterval(fetchMessage, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black to-gray-950">
      <NotificationWindow messages={messages} />
      <GradientGauge value={avgSentiment}/>
    </div>
  );
};


const NotificationWindow = ({ messages }) => (
  <div className=" border border-black shadow-lg shadow-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-4 overflow-y-auto w-11/12 h-3/4 m-auto">
    <h1 className="text-3xl font-bold mb-4 text-center shadow-xl text-white">Live Tweet Analysis</h1>
    {messages.map((message, index) => (
      <div key={index} 
      className="flex items-center shadow-inner border border-x-gray-400 mb-2 p-4 bg-white rounded-2xl"
      style={{ animation: 'slide-in 0.7s ease-out' }}
      >
        <div className="w-6 h-6 bg-gradient-to-tr from-slate-700 to-slate-800 shadow-2xl drop-shadow rounded-full flex-shrink-0 mr-4"></div>
        <span className="flex-grow">{message}</span>
        
      </div>
    ))}
  </div>
);


export default MessageFetcher;