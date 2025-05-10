import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';  
import GastosPage from './pages/GastosPage';
import EstatisticasPage from './pages/EstatisticasPage';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gastos" element={<GastosPage />} />
          <Route path="/estatisticas" element={<EstatisticasPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
