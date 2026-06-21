import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Usuario {
  id: number;
  nome: string;
}

interface Livro {
  id: number;
  titulo: string;
  status: 'DISPONIVEL' | 'EMPRESTADO';
}

interface Emprestimo {
  id: number;
  usuario: { nome: string };
  livro: { titulo: string };
  dataEmprestimo: string;
  dataDevolucaoPrevista: string;
  dataDevolucaoReal: string | null;
}

export function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [livros, setLivros] = useState<Livro[]>([]);
  
  const [usuarioId, setUsuarioId] = useState('');
  const [livroId, setLivroId] = useState('');

  async function carregarDados() {
    try {
      const [resEmprestimos, resUsuarios, resLivros] = await Promise.all([
        api.get('/emprestimos'),
        api.get('/usuarios'),
        api.get('/livros')
      ]);
      setEmprestimos(resEmprestimos.data);
      setUsuarios(resUsuarios.data);
      setLivros(resLivros.data.filter((l: Livro) => l.status === 'DISPONIVEL'));
    } catch (erro) {
      console.error("Erro ao carregar dados de empréstimos:", erro);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function lidarComEmprestimo(evento: React.SyntheticEvent) {
    evento.preventDefault();

    const novoEmprestimo = {
      usuario: { id: Number(usuarioId) },
      livro: { id: Number(livroId) }
    };

    try {
      await api.post('/emprestimos', novoEmprestimo);
      setUsuarioId('');
      setLivroId('');
      carregarDados();
      alert("Empréstimo realizado com sucesso!");
    } catch (erro: any) {
      console.error("Erro ao realizar empréstimo:", erro);
      alert(erro.response?.data || "Erro ao realizar empréstimo no servidor.");
    }
  }

  async function lidarComDevolucao(id: number) {
    try {
      await api.put(`/emprestimos/${id}/devolucao`);
      carregarDados();
      alert("Devolução registrada com sucesso!");
    } catch (erro) {
      console.error("Erro ao devolver livro:", erro);
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2>Fluxo de Empréstimos</h2>
      
      <form onSubmit={lidarComEmprestimo} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <label>Selecionar Usuário:</label>
        <select value={usuarioId} onChange={e => setUsuarioId(e.target.value)} required style={{ padding: '8px', color: '#000' }}>
          <option value="">-- Escolha um Usuário --</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>

        <label>Selecionar Livro Disponível:</label>
        <select value={livroId} onChange={e => setLivroId(e.target.value)} required style={{ padding: '8px', color: '#000' }}>
          <option value="">-- Escolha um Livro --</option>
          {livros.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
        </select>

        <button type="submit" style={{ cursor: 'pointer', padding: '8px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Confirmar Empréstimo
        </button>
      </form>

      <h3>Histórico de Empréstimos</h3>
      <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff' }}>
        <thead>
          <tr style={{ background: '#333' }}>
            <th>ID</th>
            <th>Usuário</th>
            <th>Livro</th>
            <th>Data Empréstimo</th>
            <th>Prazo Devolução</th>
            <th>Status / Ação</th>
          </tr>
        </thead>
        <tbody>
          {emprestimos.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.usuario?.nome}</td>
              <td>{emp.livro?.titulo}</td>
              <td>{new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR')}</td>
              <td>{new Date(emp.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}</td>
              <td>
                {emp.dataDevolucaoReal ? (
                  <span style={{ color: '#28a745' }}>Devolvido em {new Date(emp.dataDevolucaoReal).toLocaleDateString('pt-BR')}</span>
                ) : (
                  <button onClick={() => lidarComDevolucao(emp.id)} style={{ cursor: 'pointer', background: '#dc3545', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px' }}>
                    Devolver Livro
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}