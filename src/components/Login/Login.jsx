import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; // Adicione o caminho para sua logomarca

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);
    // Simulação de autenticação
    setTimeout(() => {
      setLoading(false);
      if (values.username === 'admin' && values.password === 'admin') {
        message.success('Login bem-sucedido');
        onLogin(); // Chama a função onLogin para atualizar o estado de autenticação
        navigate('/dashboard'); // Redireciona para o dashboard
      } else {
        message.error('Nome de usuário ou senha incorretos');
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-logo-container">
          <img src={logo} alt="Logo" className="login-logo" />
          <h1 className="login-title">EscalaCon</h1>
        </div>
        <div className="login-form-container">
          <Form
            name="login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Por favor, insira seu nome de usuário!' }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Nome de usuário" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Senha"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Lembrar-me</Checkbox>
              </Form.Item>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
