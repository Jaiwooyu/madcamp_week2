import React, { useState } from "react";
import effectCloud1 from "../assets/images/cloud.png";
import effectCloud2 from "../assets/images/cloud.png";
import effectCloud3 from "../assets/images/cloud.png";
import image1 from "../assets/images/rainbow.png";

export const Homepage = () => {
  const [htmlContent, setHtmlContent] = useState("");
  
  const handleButtonClick = async () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-gray-50 relative overflow-hidden">
      {/* Main content container */}
      <div className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-700 mb-4 tracking-wide">
            Re:PET
          </h1>
          
        </div>

        {/* Info section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl max-w-2xl mx-auto border border-yellow-100">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-gray-700">
              Re:PET 은?
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              무지개 다리를 건넌 반려 가족을<br />
              다시 만나고, 추억할 수 있는 공간입니다.
            </p>
            <button
              onClick={() => handleButtonClick("start")}
              className="w-full px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-white rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 shadow-lg text-lg font-medium"
            >
              시작하기
            </button>
          </div>
        </div>

        {/* Decorative clouds */}
        <div className="absolute top-20 left-10 w-32 h-32 opacity-40 animate-float">
          <img 
            src={effectCloud1} 
            alt="Cloud 1" 
            className="w-full h-full object-contain filter brightness-110"
          />
        </div>
        <div className="absolute top-40 right-20 w-40 h-40 opacity-50 animate-float-delayed">
          <img 
            src={effectCloud2} 
            alt="Cloud 2" 
            className="w-full h-full object-contain filter brightness-105"
          />
        </div>
        <div className="absolute bottom-20 left-1/4 w-36 h-36 opacity-30 animate-float">
          <img 
            src={effectCloud3} 
            alt="Cloud 3" 
            className="w-full h-full object-contain filter brightness-110"
          />
        </div>
      </div>

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={image1} 
          alt="Rainbow background" 
          className="w-full h-full object-cover opacity-20" 
        />
        <div className="absolute inset-0 bg-yellow-50/30"></div>
      </div>

      {/* Server HTML content */}
      {htmlContent && (
        <div
          className="html-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      )}
    </div>
  );
};

export default Homepage;