import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import ToggleThemeButton from './components/ToggleThemeButton';
import CadastroConciliador from './components/CadastroConciliador';
import CadastroStatus from './components/CadastroStatus';
import CadastroComarca from './components/CadastroComarca';
import CalendarioConciliadores from './components/CalendarioConciliadores';

const { Header, Sider, Content } = Layout;

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  return (
    <Router>
      <Layout>
        <Sider
          collapsed={collapsed}
          collapsible
          trigger={null}
          theme={darkTheme ? 'dark' : 'light'}
          className='sidebar'>
          
          <Logo collapsed={collapsed} />
          <MenuList darkTheme={darkTheme} />
          <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
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
              <Route path="/escala" element={<CalendarioConciliadores />} />
              <Route path="/cadastro/conciliador" element={<CadastroConciliador />} />
              <Route path="/cadastro/disponibilidade" element={<div>Disponibilidade</div>} />
              <Route path="/cadastro/status" element={<CadastroStatus />} />
              <Route path="/locais/comarca" element={<CadastroComarca />} />
              <Route path="/locais/juizado" element={<div>Juizado</div>} />
              <Route path="/locais/salavirtual" element={<div>Sala Virtual</div>} />
              <Route path="/configuracoes/usuarios" element={<div>Usuários</div>} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
