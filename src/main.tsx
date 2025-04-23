import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routers/router';
import { makeServer } from './mirage/server';
import reportWebVitals from './reportWebVitals';

// 僅在開發環境啟動 MirageJS 模擬伺服器
if (process.env.NODE_ENV === 'development') {
    makeServer();
  }
  
  // 掛載並渲染應用程式
  const root = ReactDOM.createRoot(document.getElementById('root')!);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );

