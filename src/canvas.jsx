import React, { useState, useEffect } from "react";
import "./App.css"; // Include your updated CSS styles
import { io } from "socket.io-client"; // Import socket.io-client

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

  // Socket.IO connection
  useEffect(() => {
    const socket = io("http://localhost:3000"); // Connect using Socket.IO

    socket.on("update", (data) => {
      console.log("Received update from server", data);
      fetchImages(); // Refresh the images when the backend sends an update
    });

    socket.on("connect_error", (error) => {
      console.error("Socket.IO connection error:", error);
    });

    return () => {
      socket.disconnect(); // Clean up Socket.IO connection on component unmount
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
          <div className="Image-container">
            <img
              src={`http://localhost:3000${currentImage}?datetime=${Date.now()}`} // Cache-busting with timestamp
              alt="Current Image"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ) : (
          <p>Loading image...</p>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;
