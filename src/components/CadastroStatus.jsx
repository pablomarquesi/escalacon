import React, { useEffect, useState, useCallback } from 'react';
import { Button, Input, Table, message, Form, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetchStatus, saveStatus, deleteStatus } from '../services/statusService';
import StatusModal from './StatusModal';
import getTableColumnsStatus from './getTableColumnsStatus';
import debounce from 'lodash/debounce';

const CadastroStatus = () => {
    const [statusList, setStatusList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const statusData = await fetchStatus();
                const sortedStatus = statusData.sort((a, b) => a.nome_status.localeCompare(b.nome_status));
                setStatusList(sortedStatus);
            } catch (error) {
                console.error('Erro ao buscar status:', error);
                message.error('Erro ao buscar status. Tente novamente.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

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

            console.log('Enviando dados:', statusData); // Log dos dados enviados

            await saveStatus(statusData);
            await fetchData();
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

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await deleteStatus(id);
            await fetchData();
            message.success('Status excluído com sucesso');
        } catch (error) {
            console.error('Erro ao excluir status:', error);
            message.error('Erro ao excluir status. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback(
        debounce((e) => {
            const value = e.target.value.toLowerCase();
            setSearchText(value);
        }, 300),
        []
    );

    const filteredStatus = searchText
        ? statusList.filter(status =>
            Object.keys(status).some(key =>
                String(status[key]).toLowerCase().includes(searchText)
            )
        )
        : statusList;

    const columns = getTableColumnsStatus(showModal, handleDelete);

    return (
        <>
            <div className="header-container">
                <h3>Relação de Status</h3>
                <Input placeholder="Buscar..." onChange={handleSearch} style={{ marginRight: 8, width: '40%' }} />
                <div className="button-group">
                    <Button 
                        icon={<PlusOutlined />} 
                        onClick={() => showModal(null)} 
                        type="primary"
                        style={{ marginRight: 8 }}>
                        Adicionar
                    </Button>
                </div>
            </div>
            <div className="table-container">
                <Spin spinning={loading}>
                    <Table 
                        dataSource={filteredStatus} 
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
            </div>
            <StatusModal
                isVisible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                form={form}
            />
        </>
    );
};

export default CadastroStatus;
