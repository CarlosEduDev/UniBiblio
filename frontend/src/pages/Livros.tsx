import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Livro {
  id?: number;
  titulo: string;
  autor: string;
  isbn: string;
  anoPublicacao: number;
  status: 'DISPONIVEL' | 'EMPRESTADO';
}

export function Livros() {
  const [livros, setLivros] = useState<Livro[]>([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [anoPublicacao, setAnoPublicacao] = useState('');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function carregarLivros() {
    try {
      const resposta = await api.get('/livros');
      setLivros(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar livros:", erro);
    }
  }

  useEffect(() => {
    carregarLivros();
  }, []);

  function ativarEdicao(livro: Livro) {
    if (livro.id) {
      setEditandoId(livro.id);
      setTitulo(livro.titulo);
      setAutor(livro.autor);
      setIsbn(livro.isbn);
      setAnoPublicacao(String(livro.anoPublicacao));
    }
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setTitulo('');
    setAutor('');
    setIsbn('');
    setAnoPublicacao('');
  }

  async function lidarComSubmissao(evento: React.SyntheticEvent) {
    evento.preventDefault();

    const livroExistente = livros.find(l => l.id === editandoId);
    const statusAtual = livroExistente ? livroExistente.status : 'DISPONIVEL';

    const dadosLivro = {
      titulo,
      autor,
      isbn,
      anoPublicacao: Number(anoPublicacao),
      status: statusAtual
    };

    try {
      if (editandoId) {
        // Envia pra endpoint de atualização: PUT /livros/{id}
        await api.put(`/livros/${editandoId}`, dadosLivro);
        alert("Livro atualizado com sucesso!");
      } else {
        // Envia pra endpoint de cadastro: POST /livros
        await api.post('/livros', dadosLivro);
        alert("Livro cadastrado com sucesso!");
      }
      cancelarEdicao();
      carregarLivros();
    } catch (erro) {
      console.error("Erro na operação:", erro);
      alert("Erro ao salvar os dados do livro.");
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>📚 Gerenciamento do Acervo de Livros</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        {/* Formulário Dinâmico (pode tanto cadastrar quanto editar livros) */}
        <form onSubmit={lidarComSubmissao} style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#1e1e1e', padding: '24px', borderRadius: '8px', border: '1px solid #333', height: 'fit-content' }}>
          <h3 style={{ fontSize: '16px', color: editandoId ? '#ffc107' : '#28a745', marginBottom: '10px' }}>
            {editandoId ? 'Editar Livro' : 'Novo Livro'}
          </h3>
          
          <input type="text" placeholder="Título do Livro" value={titulo} onChange={e => setTitulo(e.target.value)} required />
          <input type="text" placeholder="Autor do Livro" value={autor} onChange={e => setAutor(e.target.value)} required />
          <input type="text" placeholder="Código ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} required />
          <input type="number" placeholder="Ano de Publicação" value={anoPublicacao} onChange={e => setAnoPublicacao(e.target.value)} required />

          <button type="submit" style={{ background: editandoId ? '#ffc107' : '#28a745', color: editandoId ? '#000' : '#fff', marginTop: '10px' }}>
            {editandoId ? 'Salvar Alterações' : 'Cadastrar Livro'}
          </button>

          {editandoId && (
            <button type="button" onClick={cancelarEdicao} style={{ background: '#333', color: '#fff' }}>
              Cancelar
            </button>
          )}
        </form>

        <div style={{ flex: '2 1 600px' }}>
          <h3>Livros Registrados</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Autor</th>
                <th>ISBN</th>
                <th>Ano</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {livros.map(livro => (
                <tr key={livro.id}>
                  <td style={{ color: '#aaa', fontSize: '13px' }}>#{livro.id}</td>
                  <td style={{ fontWeight: 500 }}>{livro.titulo}</td>
                  <td>{livro.autor}</td>
                  <td style={{ fontFamily: 'monospace', color: '#aaa' }}>{livro.isbn}</td>
                  <td>{livro.anoPublicacao}</td>
                  <td>
                    <span style={{ 
                      backgroundColor: livro.status === 'DISPONIVEL' ? 'rgba(40, 167, 69, 0.15)' : 'rgba(220, 53, 69, 0.15)', 
                      color: livro.status === 'DISPONIVEL' ? '#28a745' : '#dc3545',
                      padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block'
                    }}>
                      {livro.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => ativarEdicao(livro)} 
                        style={{ background: '#28a745', color: '#fff', padding: '6px 12px', fontSize: '12px' }}
                      >
                        Editar
                      </button>
                    </div>
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