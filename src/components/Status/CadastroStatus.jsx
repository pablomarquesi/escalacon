import React, { useEffect, useState } from 'react';
import { Button, message, Form, Spin, Switch, Space, Tooltip, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import { fetchStatus, saveStatus, toggleStatus } from '../../services/statusService';
import StatusModal from './StatusModal';
import HeaderSection from '../common/HeaderSection';
import CustomTable from '../common/CustomTable';

const CadastroStatus = () => {
    const [statusList, setStatusList] = useState([]);
    const [filteredStatusList, setFilteredStatusList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        loadStatusList();
    }, []);

    const loadStatusList = async () => {
        setLoading(true);
        try {
            const data = await fetchStatus();
            const sortedData = data.sort((a, b) => a.nome_status.localeCompare(b.nome_status));
            setStatusList(sortedData);
            setFilteredStatusList(sortedData);
        } catch (error) {
            console.error('Erro ao buscar status:', error);
            message.error('Erro ao buscar status. Tente novamente.');
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
            const statusData = {
                nome_status: values.nome_status,
                descricao_status: values.descricao_status,
                ...(editingRecord ? { status_id: editingRecord.status_id } : {})
            };

            await saveStatus(statusData);
            loadStatusList();  // Carregar a lista após salvar
            setIsModalVisible(false);
            form.resetFields();
            message.success(editingRecord ? 'Status atualizado com sucesso' : 'Status adicionado com sucesso');
        } catch (error) {
            console.error('Erro ao salvar status:', error);
            message.error('Erro ao salvar status. Verifique os dados e tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        setLoading(true);
        try {
            await toggleStatus(id, currentStatus);
            loadStatusList();
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

        const filtered = statusList.filter(status =>
            status.nome_status.toLowerCase().includes(value)
        );
        setFilteredStatusList(filtered);
    };

    const columns = [
        {
            title: 'Nome do Status',
            dataIndex: 'nome_status',
            key: 'nome_status',
            align: 'left',
        },
        {
            title: 'Descrição',
            dataIndex: 'descricao_status',
            key: 'descricao_status',
            align: 'left',
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
                        title={`Tem certeza que deseja ${record.status === 'Ativo' ? 'inativar' : 'ativar'} este status?`}
                        onConfirm={() => handleToggleStatus(record.status_id, record.status)}
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

    return (
        <div>
            <HeaderSection
                title="Relação de Status"
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
                    dataSource={filteredStatusList} 
                    columns={columns} 
                    rowKey="status_id"
                    pagination={{
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showSizeChanger: true,
                        defaultPageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`
                    }} 
                />
            </Spin>
            <StatusModal
                isVisible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                form={form}
            />
        </div>
    );
};

export default CadastroStatus;
