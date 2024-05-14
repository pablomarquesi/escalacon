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
            const statusData = await fetchStatus();
            const sortedStatus = statusData.sort((a, b) => a.nome_status.localeCompare(b.nome_status));
            setStatusList(sortedStatus);
        };
        fetchData();
    }, []);

    const showModal = (record = null) => {
        if (record) {
            setEditingRecord(record);
            form.setFieldsValue({
                ...record,
            });
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

            const response = await saveStatus(values);
            if (response && response.status === 200) {
                const statusData = await fetchStatus();
                const sortedStatus = statusData.sort((a, b) => a.nome_status.localeCompare(b.nome_status));
                setStatusList(sortedStatus);
                setIsModalVisible(false);
                form.resetFields();
                message.success(editingRecord ? 'Status atualizado com sucesso' : 'Status adicionado com sucesso');
            } else {
                throw new Error(response.statusText);
            }
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
                        pageSizeOptions: ['10', '20', '50', '100'], // Opções de quantidade de registros por página
                        showSizeChanger: true, // Mostrar opção para mudar a quantidade de registros por página
                        defaultPageSize: 10, // Quantidade padrão de registros por página
                        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens` // Mostrar total de itens
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
