import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
  const location = useLocation();

  // Função simples para destacar o botão da página atual
  const obterEstiloLink = (path: string) => {
    const estiloBase = {
      color: '#fff',
      textDecoration: 'none',
      padding: '8px 16px',
      borderRadius: '4px',
      fontWeight: 'bold' as const,
      transition: 'background 0.2s'
    };

    return location.pathname === path
      ? { ...estiloBase, background: '#007bff' } // Azul para a página ativa
      : { ...estiloBase, background: 'transparent' };
  };

  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '15px 30px',
      background: '#1e1e1e',
      borderBottom: '1px solid #333',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
        📚 Sistema Biblioteca
      </div>
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/" style={obterEstiloLink('/')}>Dashboard</Link>
        <Link to="/usuarios" style={obterEstiloLink('/usuarios')}>Usuários</Link>
        <Link to="/livros" style={obterEstiloLink('/livros')}>Livros</Link>
        <Link to="/emprestimos" style={obterEstiloLink('/emprestimos')}>Empréstimos</Link>
      </div>
    </nav>
  );
}