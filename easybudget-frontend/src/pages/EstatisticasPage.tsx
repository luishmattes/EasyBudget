import React, { useEffect, useState } from 'react';
import api from '../services/api';

interface Estatistica {
  categoria: string;
  _sum: {
    valor: number;
  };
}

const EstatisticasPage: React.FC = () => {
  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([]);

  useEffect(() => {
    const fetchEstatisticas = async () => {
      try {
        const response = await api.get('/gastos/estatisticas');
        setEstatisticas(response.data);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };

    fetchEstatisticas();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Estatísticas por Categoria</h1>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="text-left p-2 border">Categoria</th>
            <th className="text-left p-2 border">Total Gasto (R$)</th>
          </tr>
        </thead>
        <tbody>
          {estatisticas.map((item) => (
            <tr key={item.categoria} className="border-t">
              <td className="p-2 border">{item.categoria}</td>
              <td className="p-2 border">R$ {item._sum.valor.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EstatisticasPage;
