import React, { useEffect, useState } from 'react';
import { Button, Table, message, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { fetchComarcas, saveComarca, deleteComarca } from '../../services/comarcaService'; // Caminho ajustado
import ComarcaModal from './ComarcaModal';
import getTableColumnsComarca from './getTableColumnsComarca';
import HeaderSection from '../HeaderSection';

const CadastroComarca = () => {
    const [comarcaList, setComarcaList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const comarcaData = await fetchComarcas();
                const sortedComarcas = comarcaData.sort((a, b) => a.nome_comarca.localeCompare(b.nome_comarca));
                setComarcaList(sortedComarcas);
            } catch (error) {
                console.error('Erro ao buscar comarcas:', error);
                message.error('Erro ao buscar comarcas. Tente novamente.');
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
        console.log('Valores do formulário enviados:', values);
        try {
            if (editingRecord) {
                values.comarca_id = editingRecord.comarca_id;
            }

            const response = await saveComarca(values);
            console.log('Resposta do servidor:', response);
            if (response.status === 200 || response.status === 201) {
                const comarcaData = await fetchComarcas();
                const sortedComarcas = comarcaData.sort((a, b) => a.nome_comarca.localeCompare(b.nome_comarca));
                setComarcaList(sortedComarcas);
                setIsModalVisible(false);
                form.resetFields();
                message.success(editingRecord ? 'Comarca atualizada com sucesso' : 'Comarca adicionada com sucesso');
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            console.error('Erro ao salvar comarca:', error);
            message.error('Erro ao salvar comarca. Verifique os dados e tente novamente.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteComarca(id);
            const comarcaData = await fetchComarcas();
            const sortedComarcas = comarcaData.sort((a, b) => a.nome_comarca.localeCompare(b.nome_comarca));
            setComarcaList(sortedComarcas);
            message.success('Comarca excluída com sucesso');
        } catch (error) {
            console.error('Erro ao excluir comarca:', error);
            message.error('Erro ao excluir comarca. Tente novamente.');
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
    };

    const filteredComarcas = searchText
        ? comarcaList.filter(comarca =>
            Object.keys(comarca).some(key =>
                String(comarca[key]).toLowerCase().includes(searchText)
            )
        )
        : comarcaList;

    const columns = getTableColumnsComarca(showModal, handleDelete);

    return (
        <>
            <HeaderSection
                title="Relação de Comarcas"
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
            <div className="table-container">
                <Table 
                    dataSource={filteredComarcas} 
                    columns={columns} 
                    rowKey="comarca_id"
                    pagination={{
                        pageSizeOptions: ['10', '20', '50', '100'],
                        showSizeChanger: true,
                        defaultPageSize: 10,
                        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} itens`
                    }} 
                />
            </div>
            <ComarcaModal
                isVisible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                form={form}
            />
        </>
    );
};

export default CadastroComarca;
