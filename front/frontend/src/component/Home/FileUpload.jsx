import React, { useState } from 'react';
import axios from 'axios';
import { FaFileDownload } from "react-icons/fa";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError('');
      setSuccessMessage('');
    } else {
      setSelectedFile(null);
      setError('Veuillez sélectionner un fichier PDF.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedFile) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('cv_file', selectedFile);  // Change to 'cv_file' to match Flask endpoint
      axios.post('http://localhost:5002/api/submit_cv', formData)
        .then(response => {
          console.log(response.data);
          setIsLoading(false);
          setSuccessMessage('Votre CV a été soumis avec succès.');
        })
        .catch(error => {
          console.error('Erreur lors de l\'envoi du CV:', error);
          setIsLoading(false);
        });
    } else {
      setError('Veuillez sélectionner un fichier PDF.');
    }
  };

  return (
    <div className="file-upload-container">
      <form onSubmit={handleSubmit} className="file-upload-form">
        <label htmlFor="file-input" className="custom-file-label">
          Choisissez un fichier PDF
        </label>
        <input
          type="file"
          id="file-input"
          accept=".pdf"  // Accept only PDF files
          onChange={handleFileChange}
          style={{ display: 'none' }} 
        />
        <button type="submit" className="upload-button" disabled={isLoading}>
          {isLoading ? 'Chargement...' : <><FaFileDownload className='icon' /> Déposer mon CV</>}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {selectedFile && (
        <div className="file-details">
          <p><strong>Nom du fichier:</strong> {selectedFile.name}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
