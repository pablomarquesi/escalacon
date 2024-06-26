import React, { useEffect, useState } from 'react';
import { Button, Input, Table, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetchStatus, saveStatus, deleteStatus } from '../services/statusService';
import StatusModal from './StatusModal';
import getTableColumnsStatus from './getTableColumnsStatus';

const CadastroStatus = () => {
    const [statusList, setStatusList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statusData = await fetchStatus();
                const sortedStatus = statusData.sort((a, b) => a.nome_status.localeCompare(b.nome_status));
                setStatusList(sortedStatus);
            } catch (error) {
                console.error('Erro ao buscar status:', error);
                message.error('Erro ao buscar status. Tente novamente.');
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
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            if (editingRecord) {
                values.status_id = editingRecord.status_id;
            }

            await saveStatus(values);
            const statusData = await fetchStatus();
            const sortedStatus = statusData.sort((a, b) => a.nome_status.localeCompare(b.nome_status));
            setStatusList(sortedStatus);
            setIsModalVisible(false); // Fechar o modal
            form.resetFields(); // Resetar o formulário
            message.success(editingRecord ? 'Status atualizado com sucesso' : 'Status adicionado com sucesso');
        } catch (error) {
            console.error('Erro ao salvar status:', error);
            message.error('Erro ao salvar status. Verifique os dados e tente novamente.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteStatus(id);
            const statusData = await fetchStatus();
            const sortedStatus = statusData.sort((a, b) => a.nome_status.localeCompare(b.nome_status));
            setStatusList(sortedStatus);
            message.success('Status excluído com sucesso');
        } catch (error) {
            console.error('Erro ao excluir status:', error);
            message.error('Erro ao excluir status. Tente novamente.');
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
    };

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
