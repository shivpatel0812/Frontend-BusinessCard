import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "../styles.css";

const S3ImageDisplay = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchAnalysis = async (data, imageUrl) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://8j01c6s5h4.execute-api.us-east-2.amazonaws.com/GPT-4VisionAnalysis",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const newImage = {
        url: imageUrl,
        analysis: response.data.analysis,
      };
      setImages([newImage, ...images]);
    } catch (err) {
      setError("An error occurred while fetching the analysis.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result.split(",")[1];
        fetchAnalysis({ image_data: base64Image }, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput").click();
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div>
      <h2>Image Analysis</h2>
      <button onClick={handleUploadClick} className="upload-button">
        Upload Image
      </button>
      <input
        type="file"
        id="fileInput"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="card-container">
        {images.map((image, index) => (
          <div key={index} className="card" onClick={() => openModal(image)}>
            {image.url && (
              <img src={image.url} alt="Uploaded" className="card-image" />
            )}
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
        contentLabel="Image Analysis"
      >
        {selectedImage && (
          <div className="modal-content">
            <button onClick={closeModal} className="modal-close">
              &times;
            </button>
            {selectedImage.url && (
              <img
                src={selectedImage.url}
                alt="Uploaded"
                className="modal-image"
              />
            )}
            <h3>Analysis Result:</h3>
            <pre>{selectedImage.analysis}</pre>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default S3ImageDisplay;
