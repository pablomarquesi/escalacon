import React, { useEffect, useState } from 'react';
import { Table, Form, Input, Button, Select, Modal, message, Space } from 'antd';
import { fetchJuizados, saveJuizado, deleteJuizado } from '../../services/juizadoService';
import { fetchComarcas } from '../../services/comarcaService';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import HeaderSection from '../HeaderSection';

const { Option } = Select;

const Juizado = () => {
    const [form] = Form.useForm();
    const [juizados, setJuizados] = useState([]);
    const [comarcas, setComarcas] = useState([]);
    const [editingJuizado, setEditingJuizado] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        loadJuizados();
        loadComarcas();
    }, []);

    const loadJuizados = async () => {
        try {
            const data = await fetchJuizados();
            setJuizados(data);
        } catch (error) {
            message.error('Erro ao carregar juizados');
        }
    };

    const loadComarcas = async () => {
        try {
            const data = await fetchComarcas();
            setComarcas(data);
        } catch (error) {
            message.error('Erro ao carregar comarcas');
        }
    };

    const handleFinish = async (values) => {
        try {
            await saveJuizado({ ...values, juizado_id: editingJuizado?.juizado_id });
            form.resetFields();
            setEditingJuizado(null);
            loadJuizados();
            setIsModalVisible(false);
            message.success('Juizado salvo com sucesso');
        } catch (error) {
            message.error('Erro ao salvar juizado');
        }
    };

    const handleEdit = (record) => {
        setEditingJuizado(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteJuizado(id);
            loadJuizados();
            message.success('Juizado excluído com sucesso');
        } catch (error) {
            message.error('Erro ao excluir juizado');
        }
    };

    const handleModalCancel = () => {
        setEditingJuizado(null);
        form.resetFields();
        setIsModalVisible(false);
    };

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const filteredJuizados = juizados.filter(juizado =>
        juizado.nome_juizado.toLowerCase().includes(searchText)
    );

    const columns = [
        {
            title: 'Comarca',
            dataIndex: 'nome_comarca',
            key: 'nome_comarca',
        },
        {
            title: 'Nome do Juizado',
            dataIndex: 'nome_juizado',
            key: 'nome_juizado',
        },
        {
            title: 'Ações',
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.juizado_id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <HeaderSection
                title="Gerenciar Juizados"
                onSearch={handleSearch}
                searchText={searchText}
            >
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalVisible(true)}
                >
                    Adicionar Juizado
                </Button>
            </HeaderSection>
            <Table columns={columns} dataSource={filteredJuizados} rowKey="juizado_id" />
            <Modal
                title={editingJuizado ? 'Editar Juizado' : 'Adicionar Juizado'}
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        name="comarca_id"
                        label="Comarca"
                        rules={[{ required: true, message: 'Por favor, selecione uma comarca' }]}
                    >
                        <Select placeholder="Selecione uma comarca">
                            {comarcas.map(comarca => (
                                <Option key={comarca.comarca_id} value={comarca.comarca_id}>
                                    {comarca.nome_comarca}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="nome_juizado"
                        label="Nome do Juizado"
                        rules={[{ required: true, message: 'Por favor, insira o nome do juizado' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingJuizado ? 'Salvar Alterações' : 'Adicionar'}
                            </Button>
                            <Button onClick={handleModalCancel}>
                                Cancelar
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Juizado;
