import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Modal, message, Space, Collapse, List, Tooltip, Popconfirm, Switch } from 'antd';
import { fetchSalasVirtuais, saveSalaVirtual, toggleSalaVirtualStatus, fetchTiposPauta } from '../../services/salaVirtualService';
import { fetchJuizados } from '../../services/juizadoService';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
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
            const sortedData = data.sort((a, b) => a.status_sala_virtual === 'Ativo' ? -1 : 1);
            setSalasVirtuais(sortedData);
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
            tipo_pauta_id: tiposPauta.find(tipo => tipo.nome_pauta === record.tipo_pauta)?.id,
            tipo_sala_id: tiposSala.find(tipo => tipo.nome_tipo_sala === record.tipo_sala)?.tipo_sala_id,
        });
        setIsModalVisible(true);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        try {
            await toggleSalaVirtualStatus(id, newStatus);
            message.success(`Sala virtual ${newStatus === 'Ativo' ? 'ativada' : 'inativada'} com sucesso`);
            loadSalasVirtuais();
        } catch (error) {
            console.error('Erro ao alterar status da sala virtual:', error);
            message.error(`Erro ao ${newStatus === 'Ativo' ? 'ativar' : 'inativar'} sala virtual`);
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
                                            <Tooltip title={sala.status_sala_virtual === 'Ativo' ? 'Inativar' : 'Ativar'}>
                                                <Popconfirm
                                                    title={`Tem certeza que deseja ${sala.status_sala_virtual === 'Ativo' ? 'inativar' : 'ativar'} esta sala virtual?`}
                                                    onConfirm={() => handleToggleStatus(sala.sala_virtual_id, sala.status_sala_virtual)}
                                                    okText="Sim"
                                                    cancelText="Não"
                                                >
                                                    <Switch
                                                        checked={sala.status_sala_virtual === 'Ativo'}
                                                    />
                                                </Popconfirm>
                                            </Tooltip>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            title={
                                                <div>
                                                    <span>{sala.nome_sala_virtual}</span>
                                                    <span style={{ marginLeft: '10px', color: '#888' }}>
                                                        | Tipo de Pauta: {sala.tipo_pauta}
                                                    </span>
                                                    <span style={{ marginLeft: '10px', color: '#888' }}>
                                                        | Situação: {sala.situacao}
                                                    </span>
                                                </div>
                                            }
                                            description={<></>}
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
