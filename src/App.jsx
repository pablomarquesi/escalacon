import React, { useState, useEffect } from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MenuList from './components/MenuList';
import CadastroConciliador from './components/Conciliadores/CadastroConciliador';
import CadastroStatus from './components/Status/CadastroStatus';
import CadastroComarca from './components/Comarca/CadastroComarca';
import CalendarioConciliadores from './components/CalendarioConciliadores/CalendarioConciliadores';
import Disponibilidade from "./components/Disponibilidade/Disponibilidade";
import Dashboard from './components/Dashboard';
import Juizado from "./components/Juizado/Juizado";
import SalaVirtual from "./components/SalaVirtual/SalaVirtual";
import UserMenu from './components/UserMenu/UserMenu';
import Login from './components/Login/Login';
import logo from './assets/logo.png'; // Adicione o caminho para sua logomarca

const { Header, Sider, Content, Footer } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticação no localStorage
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  return (
    <Router>
      <Layout>
        {isAuthenticated && (
          <Sider
            collapsed={collapsed}
            collapsible
            trigger={null}
            className='sidebar'>
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <MenuList collapsed={collapsed} />
          </Sider>
        )}
        <Layout className="site-layout">
          {isAuthenticated && (
            <Header style={{ padding: 0 }} className='header'>
              <Button
                type="text"
                className="toggle"
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />
              <UserMenu onLogout={handleLogout} /> {/* Passa a função handleLogout */}
            </Header>
          )}
          <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} /> {/* Passando prop para autenticar */}
              <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} /> {/* Redirecionando para login ou dashboard */}
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} /> {/* Redirecionando para login se não autenticado */}
              <Route path="/escala" element={isAuthenticated ? <CalendarioConciliadores /> : <Navigate to="/login" />} />
              <Route path="/cadastro/conciliador" element={isAuthenticated ? <CadastroConciliador /> : <Navigate to="/login" />} />
              <Route path="/cadastro/disponibilidade" element={isAuthenticated ? <Disponibilidade /> : <Navigate to="/login" />} />
              <Route path="/cadastro/status" element={isAuthenticated ? <CadastroStatus /> : <Navigate to="/login" />} />
              <Route path="/locais/comarca" element={isAuthenticated ? <CadastroComarca /> : <Navigate to="/login" />} />
              <Route path="/locais/juizado" element={isAuthenticated ? <Juizado /> : <Navigate to="/login" />} />
              <Route path="/locais/salavirtual" element={isAuthenticated ? <SalaVirtual /> : <Navigate to="/login" />} />
              <Route path="/configuracoes/usuarios" element={isAuthenticated ? <div>Usuários</div> : <Navigate to="/login" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
