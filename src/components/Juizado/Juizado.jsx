import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Modal, message, Space, Tooltip, Popconfirm, Collapse, Spin, List } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchJuizados, saveJuizado, deleteJuizado } from '../../services/juizadoService';
import { fetchComarcas } from '../../services/comarcaService';
import HeaderSection from '../common/HeaderSection';

const { Option } = Select;
const { Panel } = Collapse;

const Juizado = () => {
    const [form] = Form.useForm();
    const [juizados, setJuizados] = useState([]);
    const [comarcas, setComarcas] = useState([]);
    const [editingJuizado, setEditingJuizado] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [filteredComarcas, setFilteredComarcas] = useState([]);

    useEffect(() => {
        loadJuizados();
        loadComarcas();
    }, []);

    const loadJuizados = async () => {
        setLoading(true);
        try {
            const data = await fetchJuizados();
            setJuizados(data);
        } catch (error) {
            message.error('Erro ao carregar juizados');
        } finally {
            setLoading(false);
        }
    };

    const loadComarcas = async () => {
        setLoading(true);
        try {
            const data = await fetchComarcas();
            setComarcas(data);
            setFilteredComarcas(data); // Inicialmente, todas as comarcas são exibidas
        } catch (error) {
            message.error('Erro ao carregar comarcas');
        } finally {
            setLoading(false);
        }
    };

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            await saveJuizado({ ...values, juizado_id: editingJuizado?.juizado_id });
            form.resetFields();
            setEditingJuizado(null);
            loadJuizados();
            setIsModalVisible(false);
            message.success('Juizado salvo com sucesso');
        } catch (error) {
            message.error('Erro ao salvar juizado');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (record) => {
        setEditingJuizado(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await deleteJuizado(id);
            loadJuizados();
            message.success('Juizado excluído com sucesso');
        } catch (error) {
            message.error('Erro ao excluir juizado');
        } finally {
            setLoading(false);
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

    const handleComarcaSearch = (value) => {
        const filtered = comarcas.filter(comarca =>
            comarca.nome_comarca.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredComarcas(filtered);
    };

    const filteredJuizados = juizados.filter(juizado =>
        juizado.nome_juizado.toLowerCase().includes(searchText)
    );

    const groupedJuizados = filteredJuizados.reduce((acc, juizado) => {
        const comarca = juizado.nome_comarca;
        if (!acc[comarca]) {
            acc[comarca] = [];
        }
        acc[comarca].push(juizado);
        return acc;
    }, {});

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
                    Adicionar
                </Button>
            </HeaderSection>
            <div className="table-container">
                <Spin spinning={loading}>
                    <Collapse>
                        {Object.entries(groupedJuizados).map(([comarca, juizados]) => (
                            <Panel header={comarca} key={comarca}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={juizados}
                                    renderItem={juizado => (
                                        <List.Item
                                            actions={[
                                                <Tooltip title="Editar">
                                                    <Button
                                                        type="default"
                                                        icon={<EditOutlined />}
                                                        onClick={() => handleEdit(juizado)}
                                                    />
                                                </Tooltip>,
                                                <Tooltip title="Excluir">
                                                    <Popconfirm
                                                        title="Tem certeza que deseja excluir este juizado?"
                                                        onConfirm={() => handleDelete(juizado.juizado_id)}
                                                        okText="Sim"
                                                        cancelText="Não"
                                                    >
                                                        <Button
                                                            type="danger"
                                                            icon={<DeleteOutlined />}
                                                        />
                                                    </Popconfirm>
                                                </Tooltip>
                                            ]}
                                        >
                                            <List.Item.Meta
                                                title={juizado.nome_juizado}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Panel>
                        ))}
                    </Collapse>
                </Spin>
            </div>
            <Modal
                title={editingJuizado ? 'Editar Juizado' : 'Adicionar Juizado'}
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
                style={{ top: 20 }}
                bodyStyle={{ padding: '10px 20px' }}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        name="comarca_id"
                        label="Comarca"
                        rules={[{ required: true, message: 'Por favor, selecione uma comarca' }]}
                    >
                        <Select
                            placeholder="Selecione uma comarca"
                            showSearch
                            onSearch={handleComarcaSearch}
                            filterOption={false}
                        >
                            {filteredComarcas.map(comarca => (
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
