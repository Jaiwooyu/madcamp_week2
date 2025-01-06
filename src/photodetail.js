import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './photodetail.css';

const PhotoDetail = () => {
  const [photo, setPhoto] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhotoDetail();
  }, [id]);

  const fetchPhotoDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/photos/${id}`, {
        withCredentials: true
      });
      setPhoto(response.data);
    } catch (error) {
      console.error('사진 상세 정보 불러오기 실패:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/photos/${id}`, {
        withCredentials: true
      });
      navigate('/gallery');
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  };

  if (!photo) return null;

  return (
    <div className="detail-container">
      <div className="navbar">
        <div className="logo">Re:PET</div>
        <div className="nav-links">
          <span onClick={() => navigate('/record')}>기록하기</span>
          <span className="active">추억하기</span>
          <span onClick={() => navigate('/chat')}>대화하기</span>
        </div>
      </div>

      <div className="detail-content">
        <div className="photo-content">
          <img src={photo.imageUrl} alt={photo.title} />
          <h3>{photo.title}</h3>
          <p>{photo.content}</p>
        </div>

        <div className="button-group">
          <button onClick={handleDelete} className="delete-button">
            삭제하기
          </button>
          <button onClick={() => navigate(`/photo/edit/${id}`)} className="edit-button">
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetail;