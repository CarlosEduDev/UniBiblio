import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { type Usuario } from '../types/Usuario';

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [matricula, setMatricula] = useState('');
  const [perfil, setPerfil] = useState<'ADMIN' | 'ALUNO' | 'PROFESSOR'>('ALUNO');
  const [editandoId, setEditandoId] = useState<number | null>(null);

  async function carregarUsuarios() {
    try {
      const resposta = await api.get('/usuarios');
      setUsuarios(resposta.data);
    } catch (erro) {
      console.error("Erro ao buscar usuários:", erro);
    }
  }

  useEffect(() => { carregarUsuarios(); }, []);

  // 📝 Preenche o formulário com os dados do usuário escolhido para edição
  function ativarEdicao(usuario: Usuario) {
    if (usuario.id) {
      setEditandoId(usuario.id);
      setNome(usuario.nome);
      setEmail(usuario.email);
      setMatricula(usuario.matricula);
      setPerfil(usuario.perfilUsuario as 'ADMIN' | 'ALUNO' | 'PROFESSOR');
    }
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setNome('');
    setEmail('');
    setMatricula('');
    setPerfil('ALUNO');
  }

  async function submeterFormulario(evento: React.SyntheticEvent) {
    evento.preventDefault();
    const dadosUsuario: Usuario = { nome, email, matricula, perfilUsuario: perfil };

    try {
      if (editandoId) {
        // Rota do backend pra atualizar: PUT /usuarios/{id}
        await api.put(`/usuarios/${editandoId}`, dadosUsuario);
        alert("Usuário atualizado com sucesso!");
      } else {
        // Rota do backend pra cadastrar: POST /usuarios
        await api.post('/usuarios', dadosUsuario);
        alert("Usuário cadastrado com sucesso!");
      }
      cancelarEdicao();
      carregarUsuarios();
    } catch (erro) {
      console.error("Erro na operação:", erro);
      alert("Erro ao salvar dados do usuário.");
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>👥 Gerenciamento de Usuários</h2>
      </div>
      
      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        
        <form onSubmit={submeterFormulario} style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '16px', background: '#1e1e1e', padding: '24px', borderRadius: '8px', border: '1px solid #333', height: 'fit-content' }}>
          <h3 style={{ fontSize: '16px', color: editandoId ? '#ffc107' : '#007bff', marginBottom: '10px' }}>
            {editandoId ? 'Editar Usuário' : 'Novo Usuário'}
          </h3>
          
          <input type="text" placeholder="Nome Completo" value={nome} onChange={e => setNome(e.target.value)} required />
          <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="text" placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} required />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', color: '#aaa' }}>Tipo de Perfil</label>
            <select value={perfil} onChange={e => setPerfil(e.target.value as 'ADMIN' | 'ALUNO' | 'PROFESSOR')}>
              <option value="ALUNO">Aluno</option>
              <option value="PROFESSOR">Professor</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>

          <button type="submit" style={{ background: editandoId ? '#ffc107' : '#007bff', color: editandoId ? '#000' : '#fff', marginTop: '10px' }}>
            {editandoId ? 'Salvar Alterações' : 'Cadastrar Usuário'}
          </button>

          {editandoId && (
            <button type="button" onClick={cancelarEdicao} style={{ background: '#333', color: '#fff' }}>
              Cancelar
            </button>
          )}
        </form>


        <div style={{ flex: '2 1 600px' }}>
          <h3>Usuários na Base</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Matrícula</th>
                <th>Perfil</th>
                <th style={{ textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td style={{ color: '#aaa', fontSize: '13px' }}>#{usuario.id}</td>
                  <td style={{ fontWeight: 500 }}>{usuario.nome}</td>
                  <td>{usuario.email}</td>
                  <td style={{ fontFamily: 'monospace', color: '#aaa' }}>{usuario.matricula}</td>
                  <td>
                    <span style={{ 
                      background: usuario.perfilUsuario === 'ADMIN' ? 'rgba(0,123,255,0.15)' : 'rgba(255,255,255,0.05)',
                      color: usuario.perfilUsuario === 'ADMIN' ? '#007bff' : '#eee',
                      padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
                    }}>
                      {usuario.perfilUsuario}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button 
                        onClick={() => ativarEdicao(usuario)} 
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