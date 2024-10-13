"use client"
import React, { useState, useEffect } from 'react';
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
    <div className="p-4 h-[100vh]">
      <NotificationWindow messages={messages} />
      <GradientGauge value={avgSentiment}/>
    </div>
  );
};


const NotificationWindow = ({ messages }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 h-60 overflow-y-auto w-[90%] h-[75vh] m-auto">
      <h1 className="text-2xl font-bold mb-4">Live Tweet Analysis</h1>
      {messages.map((message, index) => (
        <div key={index} className="mb-2 p-2 bg-gray-100 rounded p-4">
          {message}
        </div>
      ))}
    </div>
  );
};

export default MessageFetcher;