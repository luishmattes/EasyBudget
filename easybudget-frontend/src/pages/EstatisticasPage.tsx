import '../styles/EstatisticasPage.css';
import React, { useEffect, useState } from 'react';
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstatisticas = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get('http://localhost:3000/gastos/estatisticas');
        setEstatisticas(data);
      } catch (error) {
        setError('Erro ao buscar estatísticas. Tente novamente.');
        console.error('Erro ao buscar estatísticas', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEstatisticas();
  }, []); 

  // Dados para o gráfico
  const pieData = {
    labels: estatisticas.map(({ categoria }) => categoria),
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: estatisticas.map(({ _sum }) => _sum.valor),
        backgroundColor: [
          '#003b5c', '#005f8d', '#2d0354', '#860802', '#0b7947',
          '#a1c9f1', '#ff6384', '#36a2eb', '#ffcd56',
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
    <div className="estatisticas-container">
      <h1 className="estatisticas-title">Estatísticas por Categoria</h1>

      {loading ? (
        <div className="loading">Carregando...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {/* Tabela */}
          <table className="table">
            <thead>
              <tr>
                <th className="table-cell">Categoria</th>
                <th className="table-cell">Total Gasto (R$)</th>
              </tr>
            </thead>
            <tbody>
              {estatisticas.map(({ categoria, _sum }) => (
                <tr key={categoria}>
                  <td className="table-cell">{categoria}</td>
                  <td className="table-cell">R$ {_sum.valor.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Gráfico de Pizza */}
          <div className="chart-container">
            <h2 className="chart-title">Representatividade por Categoria</h2>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </>
      )}

      <Link to="/gastos" className="link-voltar">
        <button className="botao-voltar">← Voltar</button>
      </Link>
    </div>
  );
};

export default EstatisticasPage;
