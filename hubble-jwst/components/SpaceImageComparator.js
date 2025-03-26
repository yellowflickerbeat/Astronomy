import React, { useState } from "react";
import { motion } from "framer-motion";
import "./SpaceImageComparator.css";

const SpaceImageComparator = () => {
  const [objectName, setObjectName] = useState("");
  const [hubbleImage, setHubbleImage] = useState(null);
  const [jwstImage, setJwstImage] = useState(null);
  const [description, setDescription] = useState("Enter an astronomical object name to fetch images.");

  const fetchImages = async () => {
    // Placeholder URLs (Replace with actual API calls)
    const hubbleUrl = `https://example.com/hubble/${objectName}.jpg`;
    const jwstUrl = `https://example.com/jwst/${objectName}.jpg`;
    setHubbleImage(hubbleUrl);
    setJwstImage(jwstUrl);
    setDescription(`Images of ${objectName} captured by Hubble (left) and JWST (right).`);
  };

  return (
    <div className="container">
      <h1 className="title">Hubble vs. JWST Image Comparator</h1>
      <p className="subtitle">Compare astronomical images taken by different space telescopes.</p>
      
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Enter celestial object..." 
          value={objectName} 
          onChange={(e) => setObjectName(e.target.value)} 
          className="input-field"
        />
        <button onClick={fetchImages} className="fetch-button">
          Fetch Images
        </button>
      </div>

      <div className="image-grid">
        <div className="image-card">
          <h2>Hubble Image</h2>
          {hubbleImage ? <motion.img src={hubbleImage} alt="Hubble" className="image" whileHover={{ scale: 1.05 }} /> : <p>No image available</p>}
        </div>
        
        <div className="image-card">
          <h2>JWST Image</h2>
          {jwstImage ? <motion.img src={jwstImage} alt="JWST" className="image" whileHover={{ scale: 1.05 }} /> : <p>No image available</p>}
        </div>
      </div>

      <motion.div className="description" whileHover={{ scale: 1.02 }}>
        <p>{description}</p>
      </motion.div>
    </div>
  );
};

export default SpaceImageComparator;
