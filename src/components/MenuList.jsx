import React from 'react';
import { Menu } from 'antd';
import {
    CalendarOutlined,
    UserOutlined,
    HourglassOutlined,
    CheckOutlined,
    BankOutlined,
    PushpinOutlined,
    VideoCameraOutlined,
    EnvironmentOutlined
    
} from '@ant-design/icons';

// Agora aceitamos um prop 'onMenuClick' para notificar sobre cliques de menu
const MenuList = ({ darkTheme, onMenuClick }) => {
  return (
    <Menu
      theme={darkTheme ? 'dark' : 'light'}
      mode='inline'
      className='menu-bar'
      onClick={onMenuClick} // Agora chamamos onMenuClick quando um item de menu é clicado
    >
        <Menu.Item key="home" icon={<CalendarOutlined />}>
            Escala
        </Menu.Item>
        <Menu.SubMenu
            key="cadastro"
            icon={<UserOutlined />}
            title="Cadastro"
        >
            <Menu.Item key="conciliador" icon={<UserOutlined />}>Conciliador</Menu.Item> 
            <Menu.Item key="disponibilidade" icon={<HourglassOutlined />}>Disponibilidade</Menu.Item>
            <Menu.Item key="status" icon={<CheckOutlined />}>Status</Menu.Item> 
        </Menu.SubMenu>
        <Menu.SubMenu
            key="locais"
            icon={<EnvironmentOutlined />}
            title="Locais"
        >
            <Menu.Item key="comarca" icon={<BankOutlined />}>Comarca</Menu.Item> 
            <Menu.Item key="juizado" icon={<PushpinOutlined />}>Juizado</Menu.Item>
            <Menu.Item key="salavirtual" icon={<VideoCameraOutlined />}>Sala Virtual</Menu.Item> 
        </Menu.SubMenu>
    </Menu>
  );
};

export default MenuList;
