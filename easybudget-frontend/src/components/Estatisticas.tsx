import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Estatistica {
  categoria: string;
  _sum: {
    valor: number;
  };
}

const Estatisticas: React.FC = () => {
  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([]);

  useEffect(() => {
    const fetchEstatisticas = async () => {
      try {
        const response = await axios.get('http://localhost:3000/gastos/estatisticas');
        setEstatisticas(response.data);
      } catch (error) {
        console.error("Erro ao buscar estatísticas", error);
      }
    };

    fetchEstatisticas();
  }, []);

  return (
    <div>
      <h2>Estatísticas por Categoria</h2>
      <ul>
        {estatisticas.map((estatistica, index) => (
          <li key={index}>
            {estatistica.categoria}: R$ {estatistica._sum.valor.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Estatisticas;
