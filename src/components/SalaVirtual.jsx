import React, { useEffect, useState } from 'react';
import { Table, Form, Input, Button, Select, Modal, message, Space } from 'antd';
import { fetchSalasVirtuais, saveSalaVirtual, deleteSalaVirtual } from '../services/salaVirtualService';
import { fetchJuizados } from '../services/juizadoService';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const SalaVirtual = () => {
    const [form] = Form.useForm();
    const [salasVirtuais, setSalasVirtuais] = useState([]);
    const [juizados, setJuizados] = useState([]);
    const [editingSalaVirtual, setEditingSalaVirtual] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        loadSalasVirtuais();
        loadJuizados();
    }, []);

    const loadSalasVirtuais = async () => {
        try {
            const data = await fetchSalasVirtuais();
            setSalasVirtuais(data);
        } catch (error) {
            message.error('Erro ao carregar salas virtuais');
        }
    };

    const loadJuizados = async () => {
        try {
            const data = await fetchJuizados();
            setJuizados(data);
        } catch (error) {
            message.error('Erro ao carregar juizados');
        }
    };

    const handleFinish = async (values) => {
        try {
            await saveSalaVirtual({ ...values, sala_virtual_id: editingSalaVirtual?.sala_virtual_id });
            form.resetFields();
            setEditingSalaVirtual(null);
            loadSalasVirtuais();
            setIsModalVisible(false);
            message.success('Sala virtual salva com sucesso');
        } catch (error) {
            message.error('Erro ao salvar sala virtual');
        }
    };

    const handleEdit = (record) => {
        setEditingSalaVirtual(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteSalaVirtual(id);
            loadSalasVirtuais();
            message.success('Sala virtual excluída com sucesso');
        } catch (error) {
            message.error('Erro ao excluir sala virtual');
        }
    };

    const handleModalCancel = () => {
        setEditingSalaVirtual(null);
        form.resetFields();
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Juizado',
            dataIndex: 'nome_juizado',
            key: 'nome_juizado',
        },
        {
            title: 'Nome da Sala Virtual',
            dataIndex: 'nome_sala_virtual',
            key: 'nome_sala_virtual',
        },
        {
            title: 'Tipo de Pauta',
            dataIndex: 'tipo_pauta',
            key: 'tipo_pauta',
        },
        {
            title: 'Situação',
            dataIndex: 'situacao',
            key: 'situacao',
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
                        onClick={() => handleDelete(record.sala_virtual_id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                style={{ marginBottom: 16 }}
            >
                Adicionar Sala Virtual
            </Button>
            <Table columns={columns} dataSource={salasVirtuais} rowKey="sala_virtual_id" />
            <Modal
                title={editingSalaVirtual ? 'Editar Sala Virtual' : 'Adicionar Sala Virtual'}
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        name="juizado_id"
                        label="Juizado"
                        rules={[{ required: true, message: 'Por favor, selecione um juizado' }]}
                    >
                        <Select placeholder="Selecione um juizado">
                            {juizados.map(juizado => (
                                <Option key={juizado.juizado_id} value={juizado.juizado_id}>
                                    {juizado.nome_juizado}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="nome_sala_virtual"
                        label="Nome da Sala Virtual"
                        rules={[{ required: true, message: 'Por favor, insira o nome da sala virtual' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="tipo_pauta"
                        label="Tipo de Pauta"
                        rules={[{ required: true, message: 'Por favor, insira o tipo de pauta' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="situacao"
                        label="Situação"
                        rules={[{ required: true, message: 'Por favor, insira a situação' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingSalaVirtual ? 'Salvar Alterações' : 'Adicionar'}
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

export default SalaVirtual;
