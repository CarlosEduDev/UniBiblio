import React, { useState, useEffect } from 'react';
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
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', color: '#aaa' }}>
        Carregando dados do painel...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>📊 Painel de Controle</h2>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
        
        <div style={{ flex: '1 1 220px', background: '#1e1e1e', padding: '24px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
          <h3 style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Usuários Cadastrados</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#007bff' }}>{indicadores.totalUsuarios}</p>
        </div>

        <div style={{ flex: '1 1 220px', background: '#1e1e1e', padding: '24px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
          <h3 style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Total de Livros</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>{indicadores.totalLivros}</p>
        </div>

        <div style={{ flex: '1 1 220px', background: '#1e1e1e', padding: '24px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
          <h3 style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Livros Emprestados</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#dc3545' }}>{indicadores.livrosEmprestados}</p>
        </div>

        <div style={{ flex: '1 1 220px', background: '#1e1e1e', padding: '24px', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
          <h3 style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Livros Disponíveis</h3>
          <p style={{ margin: 0, fontSize: '36px', fontWeight: 'bold', color: '#ffc107' }}>{indicadores.livrosDisponiveis}</p>
        </div>

      </div>

      <div style={{ background: '#1e1e1e', padding: '24px', borderRadius: '8px', border: '1px solid #333' }}>
        <h3 style={{ fontSize: '16px', color: '#007bff', marginBottom: '10px' }}>Atividades Operacionais</h3>
        <p style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6' }}>
          Até o momento, este painel administrativo já gerenciou e processou com sucesso um histórico total de <strong style={{ color: '#fff' }}>{indicadores.totalEmprestimosRealizados} transações de empréstimos</strong> no banco de dados.
        </p>
      </div>
    </div>
  );
}