import React, { useState } from 'react';
import { Layout, Button } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import ToggleThemeButton from './components/ToggleThemeButton';
import CadastroConciliador from './components/CadastroConciliador';
import CadastroStatus from './components/CadastroStatus';
import CadastroComarca from './components/CadastroComarca'; // Importe o novo componente

const { Header, Sider, Content } = Layout;

function App() {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // Novo estado para o item de menu ativo

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const handleMenuClick = (item) => {
    setActiveMenu(item.key); // Atualiza o item de menu ativo
  };

  // Esta função determina qual conteúdo renderizar com base no item de menu ativo
  const renderContent = () => {
    switch (activeMenu) {
      case 'conciliador':
        return <CadastroConciliador />;
      case 'status':
        return <CadastroStatus />;
      case 'comarca':  // Novo caso para o componente CadastroComarca
        return <CadastroComarca />;
      default:
        return <div>Selecione uma opção do menu</div>;
    }
  };

  return (
    <Layout>
      <Sider
        collapsed={collapsed}
        collapsible
        trigger={null}
        theme={darkTheme ? 'dark' : 'light'}
        className='sidebar'>
        
        <Logo collapsed={collapsed} />
        {/* Passa handleMenuClick para MenuList para que possa informar quando um item é clicado */}
        <MenuList darkTheme={darkTheme} onMenuClick={handleMenuClick} />
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
          {/* Renderiza o conteúdo com base no item de menu ativo */}
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
