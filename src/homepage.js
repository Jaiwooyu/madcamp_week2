import React, { useState } from "react";
import effectCloud1 from "./assets/images/effect-cloud-2.png";
import effectCloud2 from "./assets/images/effect-cloud-2.png";
import effectCloud3 from "./assets/images/effect-cloud-3.png";
import image1 from "./assets/images/image-1.png";

export const Homepage = () => {
  const [htmlContent, setHtmlContent] = useState("");

  // 버튼 클릭 시 HTML 요청 함수
  const handleButtonClick = async () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  return (
    <div className="screen">
      <div className="overlap">
        <div className="overlap">
          <img className="image" alt="Image" src={image1} />
          <div className="group">
            <div className="overlap-group">
              <div className="text-wrapper">Re:PET</div>
            </div>
          </div>

          <div
            className="div"
            onClick={() => handleButtonClick("login")}
          >
            로그인하기
          </div>
        </div>

        <img className="effect-cloud" alt="Effect cloud" src={effectCloud2} />
      </div>

      <div className="overlap-2">
        <p className="re-PET">
          <span className="span">Re:PET</span>
          <span className="text-wrapper-2">&nbsp;</span>
          <span className="text-wrapper-3">
            은?
            <br />
            <br />
          </span>
          <span className="text-wrapper-4">
            무지개 다리를 건넌 반려 가족을
            <br />
            다시 만나고, 추억할 수 있는 공간입니다.
          </span>
        </p>

        <div
          className="text-wrapper-5"
          onClick={() => handleButtonClick("start")}
        >
          시작하기
        </div>
      </div>

      <img className="img" alt="Effect cloud" src={effectCloud1} />
      <img className="effect-cloud-2" alt="Effect cloud" src={effectCloud3} />

      {/* 서버로부터 받은 HTML을 동적으로 렌더링 */}
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