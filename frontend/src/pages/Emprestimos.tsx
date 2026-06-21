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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>🔄 Fluxo de Empréstimos e Devoluções</h2>
      </div>
      
      {/* Container Layout de Duas Colunas */}
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Formulário de Operação (Esquerda) */}
        <form onSubmit={lidarComEmprestimo} style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '18px', background: '#1e1e1e', padding: '24px', borderRadius: '8px', border: '1px solid #333', height: 'fit-content' }}>
          <h3 style={{ fontSize: '16px', color: '#ffc107', marginBottom: '8px' }}>Nova Operação</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#aaa' }}>Selecionar Usuário</label>
            <select value={usuarioId} onChange={e => setUsuarioId(e.target.value)} required>
              <option value="">-- Escolha um Usuário --</option>
              {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#aaa' }}>Selecionar Livro Disponível</label>
            <select value={livroId} onChange={e => setLivroId(e.target.value)} required>
              <option value="">-- Escolha um Livro --</option>
              {livros.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
            </select>
          </div>

          <button type="submit" style={{ background: '#ffc107', color: '#000', marginTop: '10px' }}>
            Confirmar Empréstimo
          </button>
        </form>

        {/* Histórico de Empréstimos (Direita) */}
        <div style={{ flex: '2 1 600px' }}>
          <h3>Registro de Movimentações</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuário</th>
                <th>Livro</th>
                <th>Retirada</th>
                <th>Prazo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {emprestimos.map(emp => (
                <tr key={emp.id}>
                  <td style={{ color: '#aaa', fontSize: '13px' }}>#{emp.id}</td>
                  <td style={{ fontWeight: 500 }}>{emp.usuario?.nome}</td>
                  <td>{emp.livro?.titulo}</td>
                  <td style={{ color: '#aaa', fontSize: '13px' }}>{new Date(emp.dataEmprestimo).toLocaleDateString('pt-BR')}</td>
                  <td style={{ color: '#aaa', fontSize: '13px' }}>{new Date(emp.dataDevolucaoPrevista).toLocaleDateString('pt-BR')}</td>
                  <td>
                    {emp.dataDevolucaoReal ? (
                      <span style={{ 
                        color: '#28a745', 
                        background: 'rgba(40, 167, 69, 0.1)', 
                        padding: '4px 8px', 
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        Devolvido em {new Date(emp.dataDevolucaoReal).toLocaleDateString('pt-BR')}
                      </span>
                    ) : (
                      <button 
                        onClick={() => lidarComDevolucao(emp.id)} 
                        style={{ background: '#dc3545', color: '#fff', padding: '6px 12px', fontSize: '12px' }}
                      >
                        Devolver Livro
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}