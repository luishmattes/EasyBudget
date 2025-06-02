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
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');
  const [editando, setEditando] = useState<Gasto | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataValida, setDataValida] = useState(true);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [idExcluir, setIdExcluir] = useState<number | null>(null);

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

  const categoriasExistentes = Array.from(new Set(gastos.map((g) => g.categoria)));

  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    val = val.replace(/[^0-9,\.]/g, '');
    const partes = val.split(/[,.]/);
    if (partes.length > 2) return;
    setValor(val);
  };

  const validarData = (data: string): boolean => {
    const dataInput = new Date(data);
    return !isNaN(dataInput.getTime()) && dataInput <= new Date();
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setCategoria(input);

    if (input.length > 0) {
      const filtradas = categoriasExistentes.filter((cat) =>
        cat.toLowerCase().includes(input.toLowerCase())
      );
      setSugestoes(filtradas);
      setMostrarSugestoes(filtradas.length > 0);
    } else {
      setSugestoes(categoriasExistentes);
      setMostrarSugestoes(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const valorNumerico = parseFloat(valor.replace(',', '.'));

    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setMensagem('O valor do gasto deve ser maior que zero!');
      return;
    }

    if (!validarData(data)) {
      setDataValida(false);
      setMensagem('Data inválida! Por favor, insira uma data válida.');
      return;
    }

    const gasto = { descricao, valor: valorNumerico, categoria, data: new Date(data + 'T12:00:00').toISOString() };
    setLoading(true);

    try {
      if (editando) {
        await axios.put(`http://localhost:3000/gastos/${editando.id}`, gasto);
        setMensagem('sucesso:Gasto editado com sucesso!');
      } else {
        await axios.post('http://localhost:3000/gastos', gasto);
        setMensagem('sucesso:Gasto adicionado com sucesso!');
      }

      setDescricao('');
      setValor('');
      setCategoria('');
      setData('');
      setEditando(null);
      carregarGastos();
    } catch (error) {
      console.error('Erro ao salvar gasto:', error);
      setMensagem('Erro ao salvar gasto!');
    } finally {
      setLoading(false);
    }
  };

  const editarGasto = (gasto: Gasto) => {
    setDescricao(gasto.descricao);
    setValor(gasto.valor.toString());
    setCategoria(gasto.categoria);
    setData(gasto.data.split('T')[0]);
    setEditando(gasto);
  };

  const abrirConfirmacaoExclusao = (id: number) => {
    setIdExcluir(id);
    setMostrarConfirmacao(true);
  };


  const cancelarExclusao = () => {
    setIdExcluir(null);
    setMostrarConfirmacao(false);
  };

  const confirmarExclusao = async () => {
    if (idExcluir === null) return;
    setLoading(true);
    setMostrarConfirmacao(false);
    try {
      await axios.delete(`http://localhost:3000/gastos/${idExcluir}`);
      setMensagem('exclusao:Gasto excluído com sucesso!');
      carregarGastos();
    } catch (error) {
      console.error('Erro ao excluir gasto:', error);
      setMensagem('Erro ao excluir gasto!');
    } finally {
      setLoading(false);
      setIdExcluir(null);
    }
  };

  useEffect(() => {
    carregarGastos();
  }, []);

  // useEffect para limpar mensagem após 6 segundos
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => {
        setMensagem(null);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  return (
    <div className="container">
      <h1>Gestão de Gastos</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Descrição:</label>
          <input
            type="text"
            maxLength={15}
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Valor:</label>
          <input
            type="text"
            maxLength={15}
            value={valor}
            onChange={handleValorChange}
            required
          />
        </div>
        <div style={{ position: 'relative' }}>
          <label>Categoria:</label>
          <input
            type="text"
            value={categoria}
            onChange={handleCategoriaChange}
            onFocus={() => {
              const filtradas = categoriasExistentes;
              setSugestoes(filtradas);
              setMostrarSugestoes(filtradas.length > 0);
            }}
            onBlur={() => setTimeout(() => setMostrarSugestoes(false), 100)}
            required
          />
          {mostrarSugestoes && (
            <ul
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '100%',
                maxHeight: '150px',
                overflowY: 'auto',
                backgroundColor: 'white',
                border: '1px solid #ccc',
                borderRadius: '5px',
                zIndex: 999,
                color: '#000',
                listStyle: 'none',
                padding: '0.5rem 0',
                margin: 0,
              }}
            >
              {sugestoes.map((sugestao, index) => (
                <li
                  key={index}
                  style={{
                    padding: '0.5rem 1rem',
                    cursor: 'pointer',
                  }}
                  onMouseDown={() => {
                    setCategoria(sugestao);
                    setMostrarSugestoes(false);
                  }}
                >
                  {sugestao}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label>Data:</label>
          <input
            type="date"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
              setDataValida(!isNaN(new Date(e.target.value).getTime()));
            }}
            required
          />
        </div>

        <button className="botao-padrao" type="submit" disabled={loading}>
          {loading ? 'Carregando...' : editando ? 'Atualizar Gasto' : 'Adicionar Gasto'}
        </button>
      </form>

      {mensagem && (
        <div
          className={`mensagem ${mensagem.startsWith('exclusao:')
              ? 'mensagem-exclusao mensagem-destaque'
              : mensagem.startsWith('sucesso:')
                ? 'mensagem-sucesso mensagem-destaque'
                : 'mensagem-erro'
            }`}
        >
          {mensagem.replace(/^(exclusao:|sucesso:)/, '')}
        </div>

      )}

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
                { }
                <button onClick={() => abrirConfirmacaoExclusao(gasto.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link to="/estatisticas">
        <button className="botao-estatisticas">Estatísticas</button>
      </Link>

      <Link to="/">
        <button className="botao-sair">Sair</button>
      </Link>

      { }
      {mostrarConfirmacao && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="modal-text">
              Tem certeza que deseja excluir este gasto?
            </p>
            <div className="modal-buttons">
              <button onClick={confirmarExclusao} className="modal-button confirmar">
                Sim
              </button>
              <button onClick={cancelarExclusao} className="modal-button cancelar">
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GastosPage;
