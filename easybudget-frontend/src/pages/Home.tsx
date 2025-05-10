import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-left">
        <h1>Bem-vindo ao <strong>EasyBudget</strong></h1>
        <p className="home-welcome-message">
          Controle seus gastos, organize suas finanças e conquiste sua liberdade financeira com uma ferramenta simples e eficaz.
        </p>
      </div>
      <div className="home-right">
        <div className="home-card">
          <h2>Comece agora</h2>
          <p>Registre e acompanhe seus gastos com facilidade.</p>
          <Link to="/gastos">
            <button className="home-button">Acessar os seus gastos</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
