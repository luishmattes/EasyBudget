import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

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
      const response = await axios.get('http://localhost:3000/gastos/estatisticas');
      console.log('Dados recebidos:', response.data);  // Isso deve mostrar os dados no console
      setEstatisticas(response.data);  // Atualizando o estado com os dados recebidos
    } catch (error) {
      console.error("Erro ao buscar estatísticas", error);
    }
  };

  fetchEstatisticas();
}, []); 

  // Dados para o gráfico
  const pieData = {
    labels: estatisticas.map((item) => item.categoria),
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: estatisticas.map((item) => item._sum.valor),
        backgroundColor: [
          '#003b5c',
          '#005f8d',
          '#2d0354',
          '#860802',
          '#0b7947',
          '#a1c9f1',
          '#ff6384',
          '#36a2eb',
          '#ffcd56',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };
  

  return (
  <>
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Estatísticas por Categoria</h1>

      {/* Tabela */}
      <table className="min-w-full border border-gray-300 mb-10">
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

      {/* Gráfico de Pizza */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-4 text-black">
          Representatividade por Categoria
        </h2>
        <Pie data={pieData} options={pieOptions} />
      </div>
    </div>

    <Link to="/gastos" className="botao-sair">
      <button>← Voltar</button>
    </Link>
  </>
);

};

export default EstatisticasPage;