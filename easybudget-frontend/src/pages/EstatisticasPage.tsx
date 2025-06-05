import '../styles/EstatisticasPage.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

interface Estatistica {
  categoria: string;
  _sum: { valor: number };
}

interface Gasto {
  id: number;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
}

const EstatisticasPage: React.FC = () => {
  const [estatisticas, setEstatisticas] = useState<Estatistica[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);

  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [dropdownAberto, setDropdownAberto] = useState(false);

  const [expandirCategoria, setExpandirCategoria] = useState(false);
  const [expandirBarra, setExpandirBarra] = useState(false);


  const fetchEstatisticas = async () => {
    if (!dataInicio || !dataFim) {
      setError('Por favor, selecione a Data Início e Data Fim para filtrar.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params: any = { inicio: dataInicio, fim: dataFim };

      const [estatisticasRes, gastosRes, categoriasRes] = await Promise.all([
        axios.get('http://localhost:3000/gastos/estatisticas', { params }),
        axios.get('http://localhost:3000/gastos', { params }),
        axios.get('http://localhost:3000/gastos/categorias'),
      ]);

      setEstatisticas(estatisticasRes.data);
      setGastos(gastosRes.data);
      setCategorias(categoriasRes.data);
    } catch (error) {
      setError('Erro ao buscar dados. Tente novamente.');
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selecionadas = Array.from(e.target.selectedOptions, (option) => option.value);
    setCategoriasSelecionadas(selecionadas);
  };

  const handleCategoriaToggle = (categoria: string) => {
    if (categoriasSelecionadas.includes(categoria)) {
      setCategoriasSelecionadas(
        categoriasSelecionadas.filter((cat) => cat !== categoria)
      );
    } else {
      setCategoriasSelecionadas([...categoriasSelecionadas, categoria]);
    }
  };

  const handleSelecionarTodas = () => {
    setCategoriasSelecionadas(categorias);
  };

  const handleLimparSelecao = () => {
    setCategoriasSelecionadas([]);
  };

  const gastosFiltrados = gastos.filter((g) => {
    const dataGasto = new Date(g.data);
    const dataInicioDate = new Date(dataInicio);
    const dataFimDate = new Date(dataFim);

    const dentroDoPeriodo = dataGasto >= dataInicioDate && dataGasto <= dataFimDate;
    const categoriaSelecionada = categoriasSelecionadas.length === 0
      || categoriasSelecionadas.includes(g.categoria);

    return dentroDoPeriodo && categoriaSelecionada;
  });


  const estatisticasFiltradas = categoriasSelecionadas.length > 0
    ? estatisticas.filter((e) => categoriasSelecionadas.includes(e.categoria))
    : estatisticas;

  const pieData = {
    labels: estatisticasFiltradas.map((e) => e.categoria),
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: estatisticasFiltradas.map((e) => e._sum.valor),
        backgroundColor: [
          '#003b5c', '#08A1F3', '#480883', '#FF0D00', '#00D976',
          '#7BBEFF', '#ff6384', '#36a2eb', '#FFDC0E',
        ],
        borderWidth: 0,
      },
    ],
  };


  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' as const },
    },
    onClick: (_: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const categoria = estatisticas[index].categoria;
        if (categoriasSelecionadas.includes(categoria)) {
          setCategoriasSelecionadas(categoriasSelecionadas.filter((c) => c !== categoria));
        } else {
          setCategoriasSelecionadas([...categoriasSelecionadas, categoria]);
        }
      }
    },
  };

  const barData = {
    labels: gastosFiltrados.map((g) => new Date(g.data).toLocaleDateString('pt-BR')),
    datasets: [
      {
        label: 'Gastos por Data',
        data: gastosFiltrados.map((g) => g.valor),
        backgroundColor: '#2d0354',
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Distribuição dos Gastos por Data' },
    },
    scales: {
      x: { ticks: { color: '#001f3d' } },
      y: { ticks: { color: '#001f3d' } },
    },
  };


  return (
    <div className="estatisticas-container">

      <h1 className="estatisticas-title">Dashboard de Gastos</h1>

      <div className="filtros-container">
        <label>
          Data Início:
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </label>
        <label>
          Data Fim:
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </label>

        <div className="categoria-dropdown">
          <label>Categoria:</label>
          <div
            className="categoria-header"
            onClick={() => setDropdownAberto(!dropdownAberto)}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setDropdownAberto(!dropdownAberto); }}
          >
            {categoriasSelecionadas.length > 0
              ? categoriasSelecionadas.join(', ')
              : 'Selecione Categorias'}
            <span>{dropdownAberto ? '▲' : '▼'}</span>
          </div>

          {dropdownAberto && (
            <div className="categoria-itens">
              {categorias.length === 0 ? (
                <div className="categoria-vazia">Nenhuma categoria encontrada</div>
              ) : (
                categorias.map((cat) => (
                  <div key={cat} className="categoria-item">
                    <input
                      type="checkbox"
                      id={cat}
                      checked={categoriasSelecionadas.includes(cat)}
                      onChange={() => handleCategoriaToggle(cat)}
                    />
                    <label htmlFor={cat}>{cat}</label>
                  </div>
                ))
              )}

              <div className="categoria-actions">
                <button type="button" onClick={handleSelecionarTodas}>
                  Selecionar Todas
                </button>
                <button type="button" onClick={handleLimparSelecao}>
                  Limpar Seleção
                </button>
              </div>
            </div>
          )}
        </div>

        <button onClick={fetchEstatisticas}>Filtrar</button>
      </div>

      {estatisticas.length === 0 ? (
        <div className="mensagem-inicial">
          🔎 Selecione um intervalo de datas e clique em <b>Filtrar</b> para visualizar os dados.
        </div>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="chart-card">
              <div className="chart-header">
                <h2 className="chart-title">Gastos por Categoria</h2>
                <button onClick={() => setExpandirCategoria(true)} className="expandir-btn">🔍</button>
              </div>
              <Pie data={pieData} options={pieOptions} />
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h2 className="chart-title">Gastos por Data</h2>
                <button onClick={() => setExpandirBarra(true)} className="expandir-btn">🔍</button>
              </div>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Modal para Gráfico de Categorias */}
          {expandirCategoria && (
            <div className="modal">
              <div className="modal-content">
                <button onClick={() => setExpandirCategoria(false)} className="fechar-btn">✖</button>
                <h2>Detalhes - Gastos por Categoria</h2>
                <div className="modal-body">
                  <Pie data={pieData} options={pieOptions} />
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th>Categoria</th>
                        <th>Valor (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estatisticas
                        .sort((a, b) => b._sum.valor - a._sum.valor)
                        .map((item) => (
                          <tr key={item.categoria}>
                            <td>{item.categoria}</td>
                            <td>R$ {item._sum.valor.toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Modal para Gráfico de Barras */}
          {expandirBarra && (
            <div className="modal">
              <div className="modal-content">
                <button onClick={() => setExpandirBarra(false)} className="fechar-btn">✖</button>
                <h2>Detalhes - Gastos por Data</h2>
                <div className="modal-body">
                  <Bar data={barData} options={barOptions} />
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Valor (R$)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gastosFiltrados
                        .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
                        .map((gasto) => (
                          <tr key={gasto.id}>
                            <td>{new Date(gasto.data).toLocaleDateString('pt-BR')}</td>
                            <td>{gasto.descricao}</td>
                            <td>{gasto.categoria}</td>
                            <td>R$ {gasto.valor.toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}


          <table className="estatisticas-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor (R$)</th>
              </tr>
            </thead>
            <tbody>
              {gastosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4}>Nenhum gasto encontrado.</td>
                </tr>
              ) : (
                gastosFiltrados.map((gasto) => (
                  <tr key={gasto.id}>
                    <td>{new Date(gasto.data).toLocaleDateString('pt-BR')}</td>
                    <td>{gasto.descricao}</td>
                    <td>{gasto.categoria}</td>
                    <td>R$ {gasto.valor.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {categoriasSelecionadas.length > 0 && (
            <button className="botao-voltar" onClick={handleLimparSelecao}>
              Limpar Filtro de Categorias
            </button>
          )}
        </>
      )}

      <Link to="/gastos" className="link-voltar">
        <button className="botao-voltar">⨞ Voltar para Gastos 🔥</button>
      </Link>
    </div>
  );
};

export default EstatisticasPage;
