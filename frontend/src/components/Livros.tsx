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

  async function lidarComCadastro(evento: React.SyntheticEvent) {
    evento.preventDefault();

    const novoLivro = {
      titulo,
      autor,
      isbn,
      anoPublicacao: Number(anoPublicacao),
      status: 'DISPONIVEL' // Começa sempre disponível
    };

    try {
      await api.post('/livros', novoLivro);
      setTitulo('');
      setAutor('');
      setIsbn('');
      setAnoPublicacao('');
      carregarLivros();
      alert("Livro cadastrado com sucesso!");
    } catch (erro) {
      console.error("Erro ao cadastrar livro:", erro);
      alert("Erro ao cadastrar livro no servidor.");
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2>Gerenciamento de Livros</h2>
      
      <form onSubmit={lidarComCadastro} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="text" placeholder="Título do Livro" value={titulo} onChange={e => setTitulo(e.target.value)} required style={{ padding: '8px', color: '#000' }} />
        <input type="text" placeholder="Autor" value={autor} onChange={e => setAutor(e.target.value)} required style={{ padding: '8px', color: '#000' }} />
        <input type="text" placeholder="ISBN" value={isbn} onChange={e => setIsbn(e.target.value)} required style={{ padding: '8px', color: '#000' }} />
        <input type="number" placeholder="Ano de Publicação" value={anoPublicacao} onChange={e => setAnoPublicacao(e.target.value)} required style={{ padding: '8px', color: '#000' }} />

        <button type="submit" style={{ cursor: 'pointer', padding: '8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Cadastrar Livro
        </button>
      </form>

      <h3>Livros Cadastrados</h3>
      <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff' }}>
        <thead>
          <tr style={{ background: '#333' }}>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Ano</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {livros.map(livro => (
            <tr key={livro.id}>
              <td>{livro.id}</td>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.isbn}</td>
              <td>{livro.anoPublicacao}</td>
              <td>
                <span style={{ 
                  backgroundColor: livro.status === 'DISPONIVEL' ? '#28a745' : '#dc3545', 
                  padding: '4px 8px', 
                  borderRadius: '4px',
                  fontSize: '12px' 
                }}>
                  {livro.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}