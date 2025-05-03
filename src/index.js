import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/file_upload';
import Login from './pages/login';
import Dashboard from './pages/welcome_dashboard'; // Dashboard import
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Route to Dashboard */}
        <Route path="/file_upload" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
