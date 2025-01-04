import React from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 임포트
import './index.css'; // 스타일 파일
import { Homepage } from './homepage'; // Homepage 컴포넌트 임포트

// root element를 찾아서 ReactDOM에 전달합니다.
const rootElement = document.getElementById('root'); 

// React 18부터는 'createRoot' API를 사용하여 렌더링
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Homepage /> {/* Homepage 컴포넌트를 렌더링 */}
  </React.StrictMode>
);
