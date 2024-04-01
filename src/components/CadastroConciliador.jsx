import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, DatePicker, Select, Table } from 'antd';
import { PlusOutlined, DeleteOutlined, StopOutlined } from '@ant-design/icons';
import moment from 'moment';
import { fetchConciliadores, fetchMunicipios, saveConciliador } from "../services/conciliadorService";
import getTableColumns from "../config/tableColumns";

const CadastroConciliador = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [conciliadores, setConciliadores] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const initData = async () => {
      const conciliadoresData = await fetchConciliadores();
      const municipiosData = await fetchMunicipios();
      setConciliadores(conciliadoresData);
      setMunicipios(municipiosData);
    };
    initData();
  }, []);

  const handleEdit = (record) => {
    form.setFieldsValue({
      ...record,
      data_credenciamento: record.data_credenciamento ? moment(record.data_credenciamento) : null,
    });
    setIsModalVisible(true);
  };

  const columns = getTableColumns(handleEdit);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
  };
  
  const filteredConciliadores = searchText
    ? conciliadores.filter((conciliador) =>
        Object.keys(conciliador).some((key) =>
          String(conciliador[key]).toLowerCase().includes(searchText)
        )
      )
    : conciliadores;
  

  const onSelectChange = selectedKeys => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      data_credenciamento: values.data_credenciamento ? moment(values.data_credenciamento).format('YYYY-MM-DD') : null,
    };
    try {
      await saveConciliador(formattedValues);
      setIsModalVisible(false);
      setConciliadores(await fetchConciliadores());
      form.resetFields();
    } catch (error) {
      console.error('Erro ao adicionar o conciliador:', error);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };


    // Função que chama a API para excluir conciliadores
  const deleteConciliadores = async (selectedIds) => {
    try {
      await Promise.all(selectedIds.map(id => fetch(`/api/conciliadores/${id}`, { method: 'DELETE' })));
      // Recarrega os conciliadores após a exclusão
      setConciliadores(await fetchConciliadores());
    } catch (error) {
      console.error('Erro ao excluir conciliadores:', error);
      // Trate o erro conforme necessário
    }
  };

  // Função chamada ao clicar no botão de excluir
  const showDeleteConfirm = () => {
    Modal.confirm({
      title: 'Tem certeza que deseja excluir os conciliadores selecionados?',
      content: 'Esta ação não pode ser desfeita',
      okText: 'Sim, excluir',
      okType: 'danger',
      cancelText: 'Não',
      onOk() {
        deleteConciliadores(selectedRowKeys);
        setSelectedRowKeys([]); // Limpa a seleção
      },
    });
  };

  
  return (
    <>
      <div className="header-container">
        <h3>Relação de Conciliadores</h3>
        <Input placeholder="Buscar..." onChange={handleSearch} style={{ marginRight: 8, width: '40%' }} />
        <div className="button-group">
          <Button icon={<PlusOutlined />} onClick={() => {
            form.resetFields();
            setIsModalVisible(true);
          }} style={{ marginRight: 8 }}>
            Adicionar
          </Button>
          <Button icon={<DeleteOutlined />} onClick={showDeleteConfirm} style={{ marginRight: 8 }}>
            Excluir
          </Button>
          <Button icon={<StopOutlined />}>
            Inativar
          </Button>
        </div>
      </div>
      <div className="table-container">
        <div className="table-container">
          <Table dataSource={filteredConciliadores} columns={columns} rowSelection={rowSelection} rowKey="conciliador_id" />
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
