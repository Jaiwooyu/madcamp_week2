import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './photoupload.css';

const PhotoUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async () => {
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('content', formData.content);
    submitData.append('image', formData.image);

    try {
      const response = await axios.post('http://localhost:8080/api/photos', submitData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      navigate(`/photo/${response.data.id}`);
    } catch (error) {
      console.error('업로드 실패:', error);
    }
  };

  return (
    <div className="upload-container">
      <div className="navbar">
        <div className="logo">Re:PET</div>
        <div className="nav-links">
          <span onClick={() => navigate('/record')}>기록하기</span>
          <span className="active">추억하기</span>
          <span onClick={() => navigate('/chat')}>대화하기</span>
        </div>
      </div>

      <div className="upload-content">
        <h2>반려 가족 추억하기</h2>
        <p>떠나간 내 가족과의 순간으로 사진으로 추억해보아요</p>
        
        <div className="upload-form">
          <div className="image-upload">
            <input type="file" onChange={handleFileChange} accept="image/*" />
          </div>
          <input
            type="text"
            name="title"
            placeholder="제목"
            value={formData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="content"
            placeholder="사진에는 어떤 추억이 담겨 있나요?"
            value={formData.content}
            onChange={handleInputChange}
          />
        </div>

        <div className="button-group">
          <button onClick={() => navigate('/remember')} className="back-button">
            이전으로
          </button>
          <button onClick={handleSubmit} className="submit-button">
            완료하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoUpload;