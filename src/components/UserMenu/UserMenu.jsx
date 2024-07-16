import React from 'react';
import { Menu, Dropdown, Avatar, Button } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const UserMenu = ({ onLogout }) => {
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Dados pessoais
      </Menu.Item>
      <Menu.Item key="2" icon={<SettingOutlined />}>
        Alterar senha
      </Menu.Item>
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={onLogout}>
        Sair
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button type="text" className="user-menu-button">
        <Avatar style={{ marginRight: 8 }} icon={<UserOutlined />} />
        Nome do Usuário
      </Button>
    </Dropdown>
  );
};

export default UserMenu;
