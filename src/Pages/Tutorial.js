import React from 'react';
import '../Style/Pages/Tutorial.css';

const Tutorial = () => {
  return (
    <div className="tutorials-page">
      <h2>🚗 DIY Vehicle Repair Tutorials</h2>
      <p>Watch these videos to learn how to fix basic issues yourself.</p>

      <div className="video-grid">
        <iframe
          src="https://youtu.be/uW9taTgu7HY?si=ZuYoX2e7ZrqUckhm"
          title="How to Jumpstart a Car"
          allowFullScreen
        ></iframe>
        <iframe
          src="https://www.youtube.com/embed/G9eMyEDwIq0"
          title="How to Change a Car Tyre"
          allowFullScreen
        ></iframe>
        <iframe
          src="https://www.youtube.com/embed/Xhvfd3wGwIQ"
          title="Basic Engine Oil Check"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Tutorial;
