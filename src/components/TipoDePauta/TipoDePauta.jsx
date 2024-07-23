import React, { useState, useEffect } from 'react';
import { Button, message, Form, Spin, Switch, Space, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { fetchTiposDePauta, saveTipoDePauta, toggleTipoDePautaStatus } from '../../services/tipoDePautaService';
import TipoDePautaModal from './TipoDePautaModal';
import HeaderSection from '../common/HeaderSection';
import CustomTable from '../common/CustomTable';

const TipoDePauta = () => {
    const [tipoDePautaList, setTipoDePautaList] = useState([]);
    const [filteredTipoDePautaList, setFilteredTipoDePautaList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        loadTipoDePautaList();
    }, []);

    const loadTipoDePautaList = async () => {
        setLoading(true);
        try {
            const data = await fetchTiposDePauta();
            const sortedData = data.sort((a, b) => a.nome_pauta.localeCompare(b.nome_pauta));
            setTipoDePautaList(sortedData);
            setFilteredTipoDePautaList(sortedData);
        } catch (error) {
            console.error('Erro ao buscar tipos de pauta:', error);
            message.error('Erro ao buscar tipos de pauta. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const showModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            form.setFieldsValue({ ...record });
        } else {
            setEditingRecord(null);
            form.resetFields();
        }
        message.destroy();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const tipoDePautaData = {
                nome_pauta: values.nome_pauta,
                descricao: values.descricao,
                status: values.status,
                ...(editingRecord ? { id: editingRecord.id } : {})
            };

            await saveTipoDePauta(tipoDePautaData);
            loadTipoDePautaList();
            setIsModalVisible(false);
            form.resetFields();
            message.success(editingRecord ? 'Tipo de pauta atualizado com sucesso' : 'Tipo de pauta adicionado com sucesso');
        } catch (error) {
            console.error('Erro ao salvar tipo de pauta:', error);
            message.error('Erro ao salvar tipo de pauta. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        setLoading(true);
        try {
            await toggleTipoDePautaStatus(id, currentStatus);
            loadTipoDePautaList();
            message.success('Status alterado com sucesso');
        } catch (error) {
            console.error('Erro ao alterar status:', error);
            message.error('Erro ao alterar status. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = tipoDePautaList.filter(tipoDePauta =>
            tipoDePauta.nome_pauta.toLowerCase().includes(value)
        );
        setFilteredTipoDePautaList(filtered);
    };

    const columns = [
        {
            title: 'Nome do Tipo de Pauta',
            dataIndex: 'nome_pauta',
            key: 'nome_pauta',
            align: 'left',
            sorter: (a, b) => (a.nome_pauta || "").toString().localeCompare((b.nome_pauta || "").toString()),
        },
        {
            title: 'Descrição',
            dataIndex: 'descricao',
            key: 'descricao',
            align: 'left',
            sorter: (a, b) => (a.descricao || "").toString().localeCompare((b.descricao || "").toString()),
        },
        {
            title: 'Ações',
            key: 'actions',
            align: 'center',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => showModal(record)}
                    />
                    <Popconfirm
                        title={`Tem certeza que deseja ${record.status === 'Ativo' ? 'inativar' : 'ativar'} este tipo de pauta?`}
                        onConfirm={() => handleToggleStatus(record.id, record.status)}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <Tooltip title={record.status === 'Ativo' ? 'Desativar' : 'Ativar'}>
                            <Switch
                                checked={record.status === 'Ativo'}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        }
    };

    return (
        <div>
            <HeaderSection
                title="Relação de Tipos de Pauta"
                onSearch={handleSearch}
                searchText={searchText}
            >
                <Button 
                    icon={<PlusOutlined />} 
                    onClick={() => showModal(null)} 
                    type="primary"
                    style={{ marginRight: 8 }}>
                    Adicionar
                </Button>
            </HeaderSection>
            <Spin spinning={loading}>
                <CustomTable 
                    dataSource={filteredTipoDePautaList} 
                    columns={columns} 
                    rowKey="id"
                    rowSelection={rowSelection}
                    pagination={{
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showSizeChanger: true,
                        defaultPageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`
                    }} 
                />
            </Spin>
            <TipoDePautaModal
                isVisible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                form={form}
            />
        </div>
    );
};

export default TipoDePauta;
