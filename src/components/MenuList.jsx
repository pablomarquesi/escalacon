import React from 'react';
import { Menu } from 'antd';
import {
    AppstoreOutlined,
    CalendarOutlined,
    UserOutlined,
    HourglassOutlined,
    CheckOutlined,
    BankOutlined,
    PushpinOutlined,
    VideoCameraOutlined,
    EnvironmentOutlined,
    SettingOutlined,
    FileOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

const MenuList = ({ collapsed }) => {
    const navigate = useNavigate();

    const handleMenuClick = (e) => {
        switch (e.key) {
            case 'dashboard':
                navigate('/');
                break;
            case 'home':
                navigate('/escala');
                break;
            case 'conciliador':
                navigate('/cadastro/conciliador');
                break;
            case 'disponibilidade':
                navigate('/cadastro/disponibilidade');
                break;
            case 'salavirtual':
                navigate('/cadastro/disponibilidade/salavirtual');
                break;
            case 'conciliadores':
                navigate('/cadastro/disponibilidade');
                break;
            case 'status':
                navigate('/cadastro/status');
                break;
            case 'tipodepauta':
                navigate('/cadastro/tipodepauta');
                break;
            case 'comarca':
                navigate('/locais/comarca');
                break;
            case 'juizado':
                navigate('/locais/juizado');
                break;
            case 'locaissalavirtual':
                navigate('/locais/salavirtual');
                break;
            case 'usuarios':
                navigate('/configuracoes/usuarios');
                break;
            default:
                break;
        }
    };

    const items = [
        {
            key: 'dashboard',
            icon: <AppstoreOutlined />,
            label: 'Dashboard'
        },
        {
            key: 'home',
            icon: <CalendarOutlined />,
            label: 'Escala'
        },
        {
            key: 'cadastro',
            icon: <UserOutlined />,
            label: 'Cadastro',
            children: [
                {
                    key: 'conciliador',
                    icon: <UserOutlined />,
                    label: 'Conciliador'
                },
                {
                    key: 'disponibilidade',
                    icon: <HourglassOutlined />,
                    label: 'Disponibilidade',
                    children: [
                        {
                            key: 'conciliadores',
                            icon: <UserOutlined />,
                            label: 'Conciliadores'
                        },
                        {
                            key: 'salavirtual',
                            icon: <VideoCameraOutlined />,
                            label: 'Sala Virtual'
                        }
                    ]
                },
                {
                    key: 'status',
                    icon: <CheckOutlined />,
                    label: 'Status'
                },
                {
                    key: 'tipodepauta',
                    icon: <FileOutlined />,
                    label: 'Tipo de Pauta'
                }
            ]
        },
        {
            key: 'locais',
            icon: <EnvironmentOutlined />,
            label: 'Locais',
            children: [
                {
                    key: 'comarca',
                    icon: <BankOutlined />,
                    label: 'Comarca'
                },
                {
                    key: 'juizado',
                    icon: <PushpinOutlined />,
                    label: 'Juizado'
                },
                {
                    key: 'locaissalavirtual',
                    icon: <VideoCameraOutlined />,
                    label: 'Sala Virtual'
                }
            ]
        },
        {
            key: 'configuracoes',
            icon: <SettingOutlined />,
            label: 'Configurações',
            children: [
                {
                    key: 'usuarios',
                    icon: <UserOutlined />,
                    label: 'Usuários'
                }
            ]
        }
    ];

    return (
        <div className="sidebar">
            <Logo collapsed={collapsed} />
            <Menu
                theme="dark"
                mode='inline'
                className='menu-bar'
                onClick={handleMenuClick}
                items={items}
            />
        </div>
    );
};

export default MenuList;
