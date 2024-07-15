import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './/index.css'; // Atualizando o caminho do CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
