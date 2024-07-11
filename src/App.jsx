import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import CadastroConciliador from './components/CadastroConciliador';
import CadastroStatus from './components/CadastroStatus';
import CadastroComarca from './components/CadastroComarca';
import CalendarioConciliadores from './components/CalendarioConciliadores/CalendarioConciliadores';
import Disponibilidade from './components/Disponibilidade';
import Dashboard from './components/Dashboard';
import Juizado from './components/Juizado';
import SalaVirtual from './components/SalaVirtual';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout>
        <Sider
          collapsed={collapsed}
          collapsible
          trigger={null}
          theme='dark'
          className='sidebar'>
          
          <Logo collapsed={collapsed} />
          <MenuList />
        </Sider>
        <Layout className="site-layout">
          <Header style={{ padding: 0 }} className='header'>
            <Button
              type="text"
              className="toggle"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} /> {/* Definindo o dashboard como a página inicial */}
              <Route path="/escala" element={<CalendarioConciliadores />} />
              <Route path="/cadastro/conciliador" element={<CadastroConciliador />} />
              <Route path="/cadastro/disponibilidade" element={<Disponibilidade />} />  {/* Adicionando a rota para Disponibilidade */}
              <Route path="/cadastro/status" element={<CadastroStatus />} />
              <Route path="/locais/comarca" element={<CadastroComarca />} />
              <Route path="/locais/juizado" element={<Juizado />} /> {/* Atualizando a rota para Juizado */}
              <Route path="/locais/salavirtual" element={<SalaVirtual />} /> {/* Atualizando a rota para Sala Virtual */}
              <Route path="/configuracoes/usuarios" element={<div>Usuários</div>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
