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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-gray-50 relative">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold text-black-400 cursor-pointer hover:text-black-500 transition-colors">
            Re:PET
          </div>

          {/* Empty middle section for spacing */}
          <div className="flex-1"></div>

          {/* Login Button (positioned like profile picture) */}
          <button
            onClick={handleButtonClick}
            className="text-gray-600 hover:text-yellow-400 transition-colors"
          >
            로그인하기
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Cloud Decorations */}
        <img
          src={effectCloud1}
          alt="Cloud 1"
          className="absolute top-20 left-[10%] w-48 opacity-80 animate-float"
        />
        <img
          src={effectCloud2}
          alt="Cloud 2"
          className="absolute top-40 right-[15%] w-52 opacity-80 animate-float-delayed"
        />
        <img
          src={effectCloud3}
          alt="Cloud 3"
          className="absolute bottom-40 left-[20%] w-44 opacity-80 animate-float"
        />

        {/* Text Content */}
        <div className="text-center z-10 mt-20">
          <div className="mb-16">
            <h1 className="text-6xl mb-8">Re:PET은?</h1>
            <p className="text-2xl text-gray-700 leading-relaxed">
              무지개 다리를 건넌 반려 가족을
              <br />
              다시 만나고, 추억할 수 있는 공간입니다.
            </p>
          </div>
          <button
            onClick={() => handleButtonClick("start")}
            className="px-8 py-3 bg-yellow-200 text-gray-700 rounded-full hover:bg-yellow-300 transition-all duration-300"
          >
            구글 계정으로 시작하기
          </button>
        </div>

        {/* Rainbow Image */}
        <div className="absolute bottom-0 right-0 w-96">
          <img src={image1} alt="Rainbow" className="w-full h-auto" />
        </div>
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
