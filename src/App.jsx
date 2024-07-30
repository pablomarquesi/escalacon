import React, { useState, useEffect } from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MenuList from './components/MenuList';
import CadastroConciliador from './components/Conciliadores/CadastroConciliador';
import CadastroStatus from './components/Status/CadastroStatus';
import CadastroComarca from './components/Comarca/CadastroComarca';
import EscalaConciliadores from './components/EscalaConciliadores/EscalaConciliadores';
import DisponibilidadeConciliador from './components/DisponibilidadeConciliador/DisponibilidadeConciliador';
import DisponibilidadeSalaVirtual from './components/DisponibilidadeSalas/DisponibilidadeSalaVirtual';
import Dashboard from './components/Dashboard';
import Juizado from "./components/Juizado/Juizado";
import SalaVirtual from "./components/SalaVirtual/SalaVirtual";
import TipoDePauta from "./components/TipoDePauta/TipoDePauta";
import UserMenu from './components/UserMenu/UserMenu';
import Login from './components/Login/Login';
import './index.css';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
      <Layout style={{ minHeight: '100vh' }}>
        {isAuthenticated && (
          <Sider
            collapsed={collapsed}
            collapsible
            trigger={null}
            className='sidebar'
            style={{ height: '100vh', overflow: 'auto', position: 'fixed', left: 0 }}
          >
            <MenuList collapsed={collapsed} />
          </Sider>
        )}
        <Layout className="site-layout" style={{ marginLeft: isAuthenticated ? (collapsed ? 80 : 200) : 0 }}>
          {isAuthenticated && (
            <Header style={{ padding: 0 }} className='header'>
              <Button
                type="text"
                className="toggle"
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              />
              <UserMenu onLogout={handleLogout} />
            </Header>
          )}
          <div className='content'>
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
              <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
              <Route path="/escala" element={isAuthenticated ? <EscalaConciliadores /> : <Navigate to="/login" />} />
              <Route path="/cadastro/conciliador" element={isAuthenticated ? <CadastroConciliador /> : <Navigate to="/login" />} />
              <Route path="/cadastro/disponibilidade" element={isAuthenticated ? <DisponibilidadeConciliador /> : <Navigate to="/login" />} />
              <Route path="cadastro/disponibilidade/salavirtual" element={isAuthenticated ? <DisponibilidadeSalaVirtual /> : <Navigate to="/login" />} />
              <Route path="/cadastro/status" element={isAuthenticated ? <CadastroStatus /> : <Navigate to="/login" />} />
              <Route path="/cadastro/tipodepauta" element={isAuthenticated ? <TipoDePauta /> : <Navigate to="/login" />} />
              <Route path="/locais/comarca" element={isAuthenticated ? <CadastroComarca /> : <Navigate to="/login" />} />
              <Route path="/locais/juizado" element={isAuthenticated ? <Juizado /> : <Navigate to="/login" />} />
              <Route path="/locais/salavirtual" element={isAuthenticated ? <SalaVirtual /> : <Navigate to="/login" />} />
              <Route path="/configuracoes/usuarios" element={isAuthenticated ? <div>Usuários</div> : <Navigate to="/login" />} />
            </Routes>
          </div>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
