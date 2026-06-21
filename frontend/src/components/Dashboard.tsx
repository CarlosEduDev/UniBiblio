import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Indicadores {
  totalUsuarios: number;
  totalLivros: number;
  livrosEmprestados: number;
  livrosDisponiveis: number;
  totalEmprestimosRealizados: number;
}

export function Dashboard() {
  const [indicadores, setIndicadores] = useState<Indicadores>({
    totalUsuarios: 0,
    totalLivros: 0,
    livrosEmprestados: 0,
    livrosDisponiveis: 0,
    totalEmprestimosRealizados: 0,
  });
  const [carregando, setCarregando] = useState(true);

  async function carregarIndicadores() {
    try {
      setCarregando(true);
      const [resUsuarios, resLivros, resEmprestimos] = await Promise.all([
        api.get('/usuarios'),
        api.get('/livros'),
        api.get('/emprestimos')
      ]);

      const livros = resLivros.data;
      const emprestados = livros.filter((l: any) => l.status === 'EMPRESTADO').length;

      setIndicadores({
        totalUsuarios: resUsuarios.data.length,
        totalLivros: livros.length,
        livrosEmprestados: emprestados,
        livrosDisponiveis: livros.length - emprestados,
        totalEmprestimosRealizados: resEmprestimos.data.length
      });
    } catch (erro) {
      console.error("Erro ao carregar indicadores do dashboard:", erro);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarIndicadores();
  }, []);

  if (carregando) {
    return <div style={{ color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>Carregando dados do painel...</div>;
  }

  const estiloCard = {
    flex: '1 1 200px',
    padding: '20px',
    borderRadius: '8px',
    background: '#1e1e1e',
    border: '1px solid #333',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center' as const
  };

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#fff', padding: '10px' }}>
      <h2 style={{ marginBottom: '5px' }}>Painel de Controle</h2>
      <p style={{ color: '#aaa', marginBottom: '25px' }}>Visão geral do sistema de gerenciamento da biblioteca</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <div style={estiloCard}>
          <h3 style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '14px', textTransform: 'uppercase' }}>Usuários Cadastrados</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>{indicadores.totalUsuarios}</p>
        </div>

        <div style={estiloCard}>
          <h3 style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '14px', textTransform: 'uppercase' }}>Total de Livros</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#28a745' }}>{indicadores.totalLivros}</p>
        </div>

        <div style={estiloCard}>
          <h3 style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '14px', textTransform: 'uppercase' }}>Livros Emprestados</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#dc3545' }}>{indicadores.livrosEmprestados}</p>
        </div>

        <div style={estiloCard}>
          <h3 style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '14px', textTransform: 'uppercase' }}>Livros Disponíveis</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold', color: '#ffc107' }}>{indicadores.livrosDisponiveis}</p>
        </div>
      </div>

      {/* Seção de Atalhos Rápidos */}
      <div style={{ background: '#1e1e1e', padding: '25px', borderRadius: '8px', border: '1px solid #333' }}>
        <h3 style={{ marginTop: 0, color: '#007bff' }}>Atividades Operacionais</h3>
        <p style={{ color: '#ccc', fontSize: '14px' }}>
          Até o momento, este painel já gerenciou um histórico total de <strong>{indicadores.totalEmprestimosRealizados} transações de empréstimos</strong>.
        </p>
      </div>
    </div>
  );
}