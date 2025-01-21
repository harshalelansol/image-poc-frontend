import React, { useState, useEffect } from "react";
import "./App.css"; // Include your CSS styles

const ImageSlider = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [currentImage, setCurrentImage] = useState("");

  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/images");
      if (response.ok) {
        const imagePaths = await response.json();
        console.log("Fetched image URLs:", imagePaths);

        setImageUrls(imagePaths);
        setCurrentImage(imagePaths[0]); // Set the first image
      } else {
        console.error("Error fetching image.");
      }
    } catch (error) {
      console.error("Error fetching image URL:", error);
    }
  };

  // WebSocket connection
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080");

    // Handle WebSocket messages
    socket.onmessage = (event) => {
      if (event.data === "update") {
        console.log("Received update from server");
        fetchImages(); // Refresh the images when the backend sends an update
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close(); // Clean up WebSocket connection on component unmount
    };
  }, []);

  // Fetch images initially
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="App">
      <div className="App-header">
        {currentImage ? (
          <img
            src={`http://localhost:3000${currentImage}?datetime=${Date.now()}`} // Cache-busting with timestamp
            alt="Current Image"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <p>Loading image...</p>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;
