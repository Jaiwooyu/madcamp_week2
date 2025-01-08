/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inria: [
          '"Inria Serif-Regular"',
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "맑은 고딕",
          "Malgun Gothic",
          "sans-serif",
        ],
        "inria-bold": [
          '"Inria Serif-Bold"',
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "맑은 고딕",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      colors: {
        primary: {
          light: "#FEF9C3", // 매우 연한 노란색
          DEFAULT: "#FACC15", // 개나리색
          dark: "#EAB308", // 좀 더 진한 노란색
        },
        secondary: {
          light: "#F3F4F6", // 매우 연한 회색
          DEFAULT: "#E5E7EB", // 밝은 회색
          dark: "#D1D5DB", // 중간 회색
        },
      },
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        bounce: "bounce 1s infinite",
      },
    },
  },
  plugins: [],
};
