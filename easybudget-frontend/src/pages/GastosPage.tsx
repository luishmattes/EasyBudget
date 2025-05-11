import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Gasto {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

const GastosPage: React.FC = () => {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');
  const [editando, setEditando] = useState<Gasto | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataValida, setDataValida] = useState(true); // Estado para verificar a validade da data

  // Função para validar se a data é válida
  const validarData = (data: string): boolean => {
    const dataInput = new Date(data);
    const dataAtual = new Date();

    // Verifica se a data é válida e não é no futuro
    return dataInput.getTime() <= dataAtual.getTime() && !isNaN(dataInput.getTime());
  };

  // Função para formatar o valor, removendo o dígito '0' no início
  const formatarValor = (valor: string): string => {
    // Remove caracteres não numéricos e garanta que o valor seja maior que 0
    let novoValor = valor.replace(/[^0-9.]/g, '');
    if (novoValor.startsWith('0') && novoValor.length > 1) {
      novoValor = novoValor.substring(1); // Remove o zero à esquerda
    }
    return novoValor;
  };

  // Carregar gastos do backend
  const carregarGastos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/gastos');
      setGastos(response.data);
    } catch (error) {
      console.error('Erro ao carregar gastos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar ou editar um gasto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação de data
    if (!validarData(data)) {
      setDataValida(false);
      return; // Se a data não for válida, impede o envio do formulário
    }

    // Validação do valor
    if (valor <= 0) {
      alert('O valor do gasto deve ser maior que zero!');
      return;
    }

    const gasto = { descricao, valor, categoria, data: new Date(data + 'T12:00:00').toISOString() };
    setLoading(true);
    try {
      if (editando) {
        // Editar
        await axios.put(`http://localhost:3000/gastos/${editando.id}`, gasto);
        alert('Gasto editado com sucesso!');
      } else {
        // Criar
        await axios.post('http://localhost:3000/gastos', gasto);
        alert('Gasto adicionado com sucesso!');
      }
      // Limpar campos e recarregar os gastos
      setDescricao('');
      setValor(0);
      setCategoria('');
      setData('');
      setEditando(null);
      carregarGastos();
    } catch (error) {
      console.error('Erro ao salvar gasto:', error);
      alert('Erro ao salvar gasto!');
    } finally {
      setLoading(false);
    }
  };

  // Editar gasto
  const editarGasto = (gasto: Gasto) => {
    setDescricao(gasto.descricao);
    setValor(gasto.valor);
    setCategoria(gasto.categoria);
    setData(gasto.data.split('T')[0]);
    setEditando(gasto);
  };

  // Excluir gasto
  const excluirGasto = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este gasto?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:3000/gastos/${id}`);
        alert('Gasto excluído com sucesso!');
        carregarGastos();
      } catch (error) {
        console.error('Erro ao excluir gasto:', error);
        alert('Erro ao excluir gasto!');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    carregarGastos();
  }, []);

  return (
    <>
      <div className="container">
        <h1>Gestão de Gastos</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Descrição:</label>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Valor:</label>
            <input
              type="text"
              value={valor === 0 ? '' : valor} // Exibe valor em branco se for zero
              onChange={(e) => {
                const novoValor = formatarValor(e.target.value);
                setValor(novoValor ? parseFloat(novoValor) : 0); // Atualiza o valor
              }}
              required
            />
          </div>
          <div>
            <label>Categoria:</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Data:</label>
            <input
              type="date"
              value={data}
              onChange={(e) => {
                setData(e.target.value);
                setDataValida(validarData(e.target.value)); // Atualiza a validade da data
              }}
              required
            />
            {!dataValida && <p style={{ color: 'red' }}>Data inválida! Por favor, insira uma data válida.</p>}
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : editando ? 'Atualizar Gasto' : 'Adicionar Gasto'}
          </button>
        </form>

        <h2>Lista de Gastos</h2>
        {loading && <p>Carregando os dados...</p>}
        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Categoria</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {gastos.map((gasto) => (
              <tr key={gasto.id}>
                <td style={{ maxWidth: '200px', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                  {gasto.descricao}
                </td>
                <td>R$ {gasto.valor.toFixed(2)}</td>
                <td style={{ maxWidth: '150px', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                  {gasto.categoria}
                </td>
                <td>{new Date(gasto.data).toLocaleDateString('pt-BR')}</td>
                <td>
                  <button onClick={() => editarGasto(gasto)}>Editar</button>
                  <button onClick={() => excluirGasto(gasto.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/estatisticas" className="botao-estatisticas">
        <button>📊 Estatísticas</button>
      </Link>
      <Link to="/" className="botao-sair">
        <button>
          ← Sair
        </button>
      </Link>
    </>
  );
};

export default GastosPage;
