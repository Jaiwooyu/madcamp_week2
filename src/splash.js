import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './splash.css';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
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
      
      <div className="splash-content">
        <h1 className="splash-text">기록하기가 완료됐어요!</h1>
        <div className="circle-decoration">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Splash;