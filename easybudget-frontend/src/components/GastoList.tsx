import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  const carregarGastos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/gastos');
      setGastos(response.data);
    } catch (error) {
      console.error('Erro ao carregar gastos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const gasto = { descricao, valor, categoria, data };
    try {
      if (editando) {
        await axios.put('http://localhost:3000/gastos/${editando.id}', gasto);
        alert('Gasto editado com sucesso!');
      } else {
        await axios.post('http://localhost:3000/gastos', gasto);
        alert('Gasto adicionado com sucesso!');
      }
      setDescricao('');
      setValor(0);
      setCategoria('');
      setData('');
      setEditando(null);
      carregarGastos();
    } catch (error) {
      console.error('Erro ao salvar gasto:', error);
      alert('Erro ao salvar gasto!');
    }
  };

  const editarGasto = (gasto: Gasto) => {
    setDescricao(gasto.descricao);
    setValor(gasto.valor);
    setCategoria(gasto.categoria);
    setData(gasto.data);
    setEditando(gasto);
  };

  const excluirGasto = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este gasto?')) {
      try {
        await axios.delete('http://localhost:3000/gastos/${id}');
        alert('Gasto excluído com sucesso!');
        carregarGastos();
      } catch (error) {
        console.error('Erro ao excluir gasto:', error);
        alert('Erro ao excluir gasto!');
      }
    }
  };

  useEffect(() => {
    carregarGastos();
  }, []);

  return (
    <div className="container">
      <h1>Gestão de Gastos</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
          required
        />
        <input
          type="text"
          placeholder="Categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
        <button type="submit">
          {editando ? 'Atualizar Gasto' : 'Adicionar Gasto'}
        </button>
      </form>

      <h2>Lista de Gastos</h2>
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
              <td>{gasto.descricao}</td>
              <td>R$ {gasto.valor.toFixed(2)}</td>
              <td>{gasto.categoria}</td>
              <td>{new Date(gasto.data).toLocaleDateString()}</td>
              <td>
                <button onClick={() => editarGasto(gasto)}>Editar</button>
                <button onClick={() => excluirGasto(gasto.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GastosPage;