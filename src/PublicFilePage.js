import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PublicFilePage = () => {
  const { fileId } = useParams(); // Get the fileId from the URL
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the file details using the fileId from the URL
    fetch(`http://localhost:3080/files/${fileId}`)
      .then((response) => response.json())
      .then((data) => {
        setFile(data.file);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching file:', error);
        setLoading(false);
      });
  }, [fileId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!file) {
    return <div>File not found</div>;
  }

  return (
    <div className="publicFilePage">
      <h1>{file.filename}</h1>
      <p>Views: {file.views}</p>
      <div className="file-container">
        {file.filename.endsWith('.jpg') || file.filename.endsWith('.png') ? (
          <img src={`http://localhost:3080${file.path}`} alt={file.filename} />
        ) : file.filename.endsWith('.mp4') ? (
          <video controls>
            <source src={`http://localhost:3080${file.path}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <p>File type not supported for preview</p>
        )}
      </div>
    </div>
  );
};

export default PublicFilePage;
