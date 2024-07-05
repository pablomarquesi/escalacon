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
    EnvironmentOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const MenuList = ({ darkTheme }) => {
    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        switch (e.key) {
            case 'home':
                navigate('/escala');
                break;
            case 'conciliador':
                navigate('/cadastro/conciliador');
                break;
            case 'disponibilidade':
                navigate('/cadastro/disponibilidade');
                break;
            case 'status':
                navigate('/cadastro/status');
                break;
            case 'comarca':
                navigate('/locais/comarca');
                break;
            case 'juizado':
                navigate('/locais/juizado');
                break;
            case 'salavirtual':
                navigate('/locais/salavirtual');
                break;
            case 'usuarios':
                navigate('/configuracoes/usuarios');
                break;
            default:
                break;
        }
    };

    return (
        <Menu
            theme={darkTheme ? 'dark' : 'light'}
            mode='inline'
            className='menu-bar'
            onClick={handleMenuClick}
        >
            <Menu.Item key="home" icon={<CalendarOutlined />}>
                Escala
            </Menu.Item>
            <Menu.SubMenu
                key="cadastro"
                icon={<UserOutlined />}
                title="Cadastro"
            >
                <Menu.Item key="conciliador" icon={<UserOutlined />}>
                    Conciliador
                </Menu.Item>
                <Menu.Item key="disponibilidade" icon={<HourglassOutlined />}>
                    Disponibilidade
                </Menu.Item>
                <Menu.Item key="status" icon={<CheckOutlined />}>
                    Status
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
                key="locais"
                icon={<EnvironmentOutlined />}
                title="Locais"
            >
                <Menu.Item key="comarca" icon={<BankOutlined />}>
                    Comarca
                </Menu.Item>
                <Menu.Item key="juizado" icon={<PushpinOutlined />}>
                    Juizado
                </Menu.Item>
                <Menu.Item key="salavirtual" icon={<VideoCameraOutlined />}>
                    Sala Virtual
                </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
                key="configuracoes"
                icon={<SettingOutlined />}
                title="Configurações"
            >
                <Menu.Item key="usuarios" icon={<UserOutlined />}>
                    Usuários
                </Menu.Item>
            </Menu.SubMenu>
        </Menu>
    );
};

export default MenuList;
