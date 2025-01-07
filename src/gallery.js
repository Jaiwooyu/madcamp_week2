import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './commom.css';
import './gallery.css';

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/board', {
        withCredentials: true
      });
      setPhotos(response.data);
    } catch (error) {
      console.error('사진 불러오기 실패:', error);
    }
  };

  const handlePhotoClick = (photoId) => {
    navigate(`/photo/${photoId}`);
  };

  return (
    <div className="gallery-container">
      <div className="navbar">
        <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
        Re:PET    
        </div>
        <div className="nav-links">
          <span onClick={() => navigate('/record')}>기록하기</span>
          <span onClick={() => navigate('/remember')}>추억하기</span>
          <span onClick={() => navigate('/chat')}>대화하기</span>
        </div>
      </div>

      <div className="content">
        <div className="left-section">
          <h2>~~이와의 추억</h2>
          <button onClick={() => navigate('/photo/upload')} className="upload-button">
            업로드하기
          </button>
        </div>
        
        <div className="right-section">
          <div className="photo-grid">
            {photos.map((photo) => (
              <div 
                key={photo.id} 
                className="photo-item"
                onClick={() => handlePhotoClick(photo.id)}
              >
                <img src={photo.imageFileName ? `http://localhost:8080${photo.imageFileName}` : 'default-image.png'} alt={photo.title} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;