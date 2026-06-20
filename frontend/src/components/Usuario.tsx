import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { type Usuario } from '../types/Usuario';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [perfil, setPerfil] = useState<'ADMIN' | 'ALUNO' | 'PROFESSOR'>('ALUNO');

  async function carregarUsuarios() {
    try {
      const resposta = await api.get('/usuarios');
      setUsuarios(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar usuários do Java:", erro);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // Alterado para usar o FormEvent nativo do escopo do React estável
  async function lidarComCadastro(evento: React.SyntheticEvent) {
    evento.preventDefault();
    
    // Explicitando chave e valor para garantir que o TypeScript não perca o escopo
    const novoUsuario: Usuario = { 
      nome: nome, 
      email: email, 
      matricula: matricula, 
      perfilUsuario: perfil 
    };

    try {
      await api.post('/usuarios', novoUsuario);
      setNome('');
      setEmail('');
      setMatricula('');
      setPerfil('ALUNO');
      carregarUsuarios();
      alert("Usuário cadastrado com sucesso!");
    } catch (erro) {
      console.error("Erro ao cadastrar usuário:", erro);
      alert("Erro ao cadastrar usuário no servidor.");
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', color: '#fff' }}>
      <h2>Gerenciamento de Usuários (Biblioteca)</h2>
      
      <form onSubmit={lidarComCadastro} style={{ marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} required style={{ padding: '8px', color: '#000' }} />
        <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '8px', color: '#000' }} />
        <input type="text" placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} required style={{ padding: '8px', color: '#000' }} />
        
        <label>Tipo de Perfil:</label>
        <select value={perfil} onChange={e => setPerfil(e.target.value as 'ADMIN' | 'ALUNO' | 'PROFESSOR')} style={{ padding: '8px', color: '#000' }}>
          <option value="ALUNO">Aluno</option>        {/* Antes o 'value' podia estar errado */}
          <option value="PROFESSOR">Professor</option>  {/* Antes o 'value' podia estar errado */}
          <option value="ADMIN">Administrador</option>
        </select>
        <button type="submit" style={{ cursor: 'pointer', padding: '8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Cadastrar Usuário
        </button>
      </form>

      <h3>Usuários Cadastrados</h3>
      <table border={1} cellPadding={8} style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#fff' }}>
        <thead>
          <tr style={{ background: '#333' }}>
            <th>ID</th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Matrícula</th>
            <th>Perfil</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>{usuario.matricula}</td>
              <td><strong>{usuario.perfilUsuario}</strong></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}