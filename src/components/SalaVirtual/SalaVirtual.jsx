import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Modal, message, Space, Collapse, List, Tooltip, Popconfirm } from 'antd';
import { fetchSalasVirtuais, saveSalaVirtual, deleteSalaVirtual, fetchTiposPauta } from '../../services/salaVirtualService';
import { fetchJuizados } from '../../services/juizadoService';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import HeaderSection from '../common/HeaderSection';

const { Option } = Select;
const { Panel } = Collapse;

const SalaVirtual = () => {
    const [form] = Form.useForm();
    const [salasVirtuais, setSalasVirtuais] = useState([]);
    const [juizados, setJuizados] = useState([]);
    const [tiposPauta, setTiposPauta] = useState([]);
    const [editingSalaVirtual, setEditingSalaVirtual] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        loadSalasVirtuais();
        loadJuizados();
        loadTiposPauta();
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

    const loadTiposPauta = async () => {
        try {
            const data = await fetchTiposPauta();
            setTiposPauta(data);
        } catch (error) {
            message.error('Erro ao carregar tipos de pauta');
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
        form.setFieldsValue({
            ...record,
            tipo_pauta_id: tiposPauta.find(tipo => tipo.nome_pauta === record.tipo_pauta)?.id
        });
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

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    };

    const filteredSalasVirtuais = salasVirtuais.filter(sala =>
        sala.nome_sala_virtual.toLowerCase().includes(searchText)
    );

    const groupedSalasVirtuais = filteredSalasVirtuais.reduce((acc, sala) => {
        const juizado = sala.nome_juizado;
        if (!acc[juizado]) {
            acc[juizado] = [];
        }
        acc[juizado].push(sala);
        return acc;
    }, {});

    return (
        <div>
            <HeaderSection
                title="Gerenciar Salas Virtuais"
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
                <Collapse>
                    {Object.entries(groupedSalasVirtuais).map(([juizado, salas]) => (
                        <Panel header={juizado} key={juizado}>
                            <List
                                itemLayout="horizontal"
                                dataSource={salas}
                                renderItem={sala => (
                                    <List.Item
                                        actions={[
                                            <Tooltip title="Editar">
                                                <Button
                                                    type="default"
                                                    icon={<EditOutlined />}
                                                    onClick={() => handleEdit(sala)}
                                                />
                                            </Tooltip>,
                                            <Tooltip title="Excluir">
                                                <Popconfirm
                                                    title="Tem certeza que deseja excluir esta sala virtual?"
                                                    onConfirm={() => handleDelete(sala.sala_virtual_id)}
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
                                            title={sala.nome_sala_virtual}
                                            description={
                                                <>
                                                    <p>
                                                        <strong>Tipo de Pauta:</strong> {sala.tipo_pauta} | 
                                                        <strong> Situação:</strong> {sala.situacao}
                                                    </p>
                                                </>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Panel>
                    ))}
                </Collapse>
            </div>
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
                        name="tipo_pauta_id"
                        label="Tipo de Pauta"
                        rules={[{ required: true, message: 'Por favor, selecione o tipo de pauta' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Selecione um tipo de pauta"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {tiposPauta.map(tipo => (
                                <Option key={tipo.id} value={tipo.id}>
                                    {tipo.nome_pauta}
                                </Option>
                            ))}
                        </Select>
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
