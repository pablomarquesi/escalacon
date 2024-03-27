import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, DatePicker, Select, Table } from 'antd';
import { PlusOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import { EditOutlined } from '@ant-design/icons';

const CadastroConciliador = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [conciliadores, setConciliadores] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [form] = Form.useForm();
  const { Option } = Select;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    const fetchConciliadores = async () => {
      try {
        const result = await axios.get('http://localhost:3000/api/conciliadores');
        setConciliadores(result.data);
      } catch (error) {
        console.error('Falha ao buscar conciliadores:', error);
      }
    };

    const fetchMunicipios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/comarcas');
        setMunicipios(response.data);
      } catch (error) {
        console.error('Falha ao carregar municípios:', error);
      }
    };

    fetchConciliadores();
    fetchMunicipios();
  }, []);

  const onSelectChange = selectedKeys => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: 'Matrícula',
      dataIndex: 'matricula',
      sorter: (a, b) => a.matricula - b.matricula,
    },
    {
      title: 'Nome',
      dataIndex: 'nome_conciliador',
      sorter: (a, b) => (a.nome_conciliador || "").toString().localeCompare((b.nome_conciliador || "").toString()),
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      sorter: (a, b) => (a.cpf || "").toString().localeCompare((b.cpf || "").toString()),
    },
    {
      title: 'Telefone',
      dataIndex: 'telefone',
      sorter: (a, b) => (a.telefone || "").toString().localeCompare((b.telefone || "").toString()),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => (a.email || "").toString().localeCompare((b.email || "").toString()),
    },
    {
      title: 'Comarca',
      dataIndex: 'nome_comarca',
      sorter: (a, b) => a.nome_comarca.localeCompare(b.nome_comarca),
    },
    {
      title: 'Data de Credenciamento',
      dataIndex: 'data_credenciamento',
      render: (text) => (text ? moment(text).format('DD/MM/YYYY') : ''),
      sorter: (a, b) => {
        // Assegura que datas nulas são tratadas corretamente, assumindo como a menor data possível
        const dateA = a.data_credenciamento ? moment(a.data_credenciamento).valueOf() : -Infinity;
        const dateB = b.data_credenciamento ? moment(b.data_credenciamento).valueOf() : -Infinity;
        return dateA - dateB;
      },
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async values => {
    const formattedValues = {
      ...values,
      comarca_id: values.comarca_id, // Garanta que o nome do campo esteja correto
      data_credenciamento: values.data_credenciamento ? moment(values.data_credenciamento).format('YYYY-MM-DD') : null,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/conciliadores', formattedValues);
      if (response.status === 201) {
        setIsModalVisible(false);
        await fetchConciliadores();
        form.resetFields();
      }
    } catch (error) {
      console.error('Erro ao adicionar o conciliador:', error);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };


  // Função para abrir o modal em modo de edição
const openEditModal = (record) => {
  // Correção aqui: assegure que os nomes dos campos correspondam ao seu formulário
  form.setFieldsValue({
    matricula: record.matricula,
    nome: record.nome_conciliador, // Correção aplicada aqui para o nome
    cpf: record.cpf,
    telefone: record.telefone,
    email: record.email,
    comarca_id: record.comarca_id,
    data_credenciamento: record.data_credenciamento ? moment(record.data_credenciamento) : null,
  });
  setIsModalVisible(true);
};

columns.push({
  title: 'Ação',
  key: 'acao',
  render: (_, record) => (
    <Button
      type="primary"
      icon={<EditOutlined />}
      onClick={() => openEditModal(record)}
      // Removido a label "Editar"
    />
  ),
})

  return (
    <>
      <h1>Conciliadores</h1> {/* Título da página */}
      <Button icon={<PlusOutlined />} onClick={() => {
        form.resetFields(); // Assegura que o formulário esteja limpo para um novo cadastro
        setIsModalVisible(true);
      }} style={{ marginRight: 8 }}>
        Adicionar
      </Button>
      <Button icon={<DeleteOutlined />} style={{ marginRight: 8 }}>
        Excluir
      </Button>
      <Button icon={<StopOutlined />}>
        Inativar
      </Button>
      <div className="table-container">
      <div className="table-container">
        <Table dataSource={conciliadores} columns={columns} rowSelection={rowSelection} rowKey="conciliador_id" />
      </div>
      </div>
      
      <Modal title="Cadastro de Conciliador" visible={isModalVisible} onCancel={handleCancel} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="matricula" label="Matrícula" rules={[{ required: true, message: 'Insira a matrícula!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Insira o nome!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="cpf" label="CPF" rules={[{ required: true, message: 'Insira o CPF!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="telefone" label="Telefone" rules={[{ required: true, message: 'Insira o telefone!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Insira o e-mail!', type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="comarca_id" label="Comarca" rules={[{ required: true, message: 'Selecione a comarca!' }]}>
            <Select placeholder="Selecione">
              {municipios.map(municipio => (
                <Option key={municipio.comarca_id} value={municipio.comarca_id}>
                  {municipio.nome_comarca}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="data_credenciamento" label="Data de Credenciamento" rules={[{ required: true, message: 'Selecione a data de credenciamento!' }]}>
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Salvar
            </Button>
            <Button htmlType="button" onClick={handleReset}>
              Limpar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CadastroConciliador;
