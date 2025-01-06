import React from "react";
import cloudImage from "../assets/images/cloud.png";
import rainbowImage from "../assets/images/rainbow.png";

const Homepage = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const styles = {
    homepage: {
      minHeight: "100vh",
      backgroundColor: "white",
      position: "relative",
      overflow: "hidden"
    },
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 40px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
    },
    logo: {
      fontSize: "24px",
      fontWeight: "bold"
    },
    loginButton: {
      padding: "8px 20px",
      border: "none",
      background: "none",
      cursor: "pointer",
      fontSize: "16px",
      color: "#666"
    },
    mainContent: {
      position: "relative",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "60px 20px",
      minHeight: "calc(100vh - 76px)", // 네비게이션 바 높이(76px)를 뺀 전체 높이
      display: "flex",           // Flex 컨테이너로 변경
      flexDirection: "column",   // 수직 방향 정렬
      justifyContent: "center"   // 수직 중앙 정렬
    },
    cloudLeft: {
      position: "absolute",
      width: "200px",
      height: "auto",
      top: "10%",               // 퍼센트로 변경하여 반응형으로 조정
      left: "80px"
    },
    cloudRight: {
      position: "absolute",
      width: "150px",
      height: "auto",
      top: "5%",               // 퍼센트로 변경하여 반응형으로 조정
      right: "80px"
    },
    textSection: {
      textAlign: "center",
      position: "relative",      // 상대적 위치 지정
      zIndex: "1"   
    },
    title: {
      fontSize: "80px",
      fontWeight: "bold",
      marginBottom: "20px"
    },
    description: {
      fontSize: "30px",
      color: "#333",
      lineHeight: "1.6",
      marginBottom: "40px"
    },
    startButton: {
      padding: "15px 40px",
      border: "none",
      borderRadius: "25px",
      backgroundColor: "#FFE7A0",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.2s"
    },
    rainbowImage: {
      position: "absolute",
      bottom: "0",
      right: "0",
      width: "400px",
      height: "auto",
      maxWidth: "40%",          // 반응형을 위한 최대 너비 제한
      zIndex: "0"               // 텍스트보다 아래에 위치
    }
  };

  return (
    <div style={styles.homepage}>
      {/* 네비게이션 바 */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>Re:PET</div>
        <button style={styles.loginButton} onClick={handleGoogleLogin}>
          로그인
        </button>
      </nav>

      {/* 메인 컨텐츠 */}
      <div style={styles.mainContent}>
        {/* 구름 이미지 */}
        <img
          src={cloudImage}
          alt="구름1"
          style={styles.cloudLeft}
        />
        <img
          src={cloudImage}
          alt="구름2"
          style={styles.cloudRight}
        />

        {/* 중앙 텍스트 섹션 */}
        <div style={styles.textSection}>
          <h1 style={styles.title}>Re:PET은?</h1>
          <p style={styles.description}>
            무지개 다리를 건넌 반려 가족을<br />
            다시 만나고, 추억할 수 있는 공간입니다.
          </p>
          <button style={styles.startButton} onClick={handleGoogleLogin}>
            구글 계정으로 시작하기
          </button>
        </div>

        {/* 무지개 이미지 */}
        <img
          src={rainbowImage}
          alt="무지개"
          style={styles.rainbowImage}
        />
      </div>
    </div>
  );
};

export default Homepage;