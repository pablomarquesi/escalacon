import { PlusOutlined } from '@ant-design/icons';
import { Button, Input, Table, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import getTableColumns from "./getTableColumnsConciliador";
import { fetchConciliadores, fetchMunicipios, deleteConciliadorService, saveConciliador } from "../services/conciliadorService";
import ConciliadorModal from './ConciliadorModal';
import moment from 'moment';

const CadastroConciliador = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [conciliadores, setConciliadores] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [editingRecord, setEditingRecord] = useState(null);

    useEffect(() => {
        const initData = async () => {
            const conciliadoresData = await fetchConciliadores();
            const municipiosData = await fetchMunicipios();
            setConciliadores(conciliadoresData);
            setMunicipios(municipiosData);
        };
        initData();
    }, []);

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue({
            ...record,
            data_credenciamento: record.data_credenciamento ? moment(record.data_credenciamento) : null,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteConciliadorService(id);
            message.success('Conciliador excluído com sucesso');
            const conciliadoresData = await fetchConciliadores();
            setConciliadores(conciliadoresData);
        } catch (error) {
            console.error('Erro ao excluir conciliador:', error);
            message.error('Erro ao excluir conciliador. Tente novamente.');
        }
    };

    const columns = getTableColumns(handleEdit, handleDelete);

    const showModal = () => {
        setEditingRecord(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSubmit = async (values) => {
        try {
            const cleanedCPF = values.cpf.replace(/\D/g, '');
            const cleanedTelefone = values.telefone.replace(/\D/g, '');
            const formattedValues = {
                ...values,
                cpf: cleanedCPF,
                telefone: cleanedTelefone,
                data_credenciamento: values.data_credenciamento ? moment(values.data_credenciamento).format('YYYY-MM-DD') : null,
            };

            if (editingRecord) {
                formattedValues.conciliador_id = editingRecord.conciliador_id;
            }

            await saveConciliador(formattedValues);
            const conciliadoresData = await fetchConciliadores();
            setConciliadores(conciliadoresData);
            setIsModalVisible(false);
            form.resetFields();
            message.success(editingRecord ? 'Conciliador atualizado com sucesso' : 'Conciliador adicionado com sucesso');
        } catch (error) {
            console.error('Erro ao salvar conciliador:', error);
            message.error('Erro ao salvar conciliador. Verifique os dados e tente novamente.');
        }
    };

    const handleReset = () => {
        form.resetFields();
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
    };

    const filteredConciliadores = searchText
        ? conciliadores.filter(conciliador =>
            Object.keys(conciliador).some(key =>
                String(conciliador[key]).toLowerCase().includes(searchText)
            )
        )
        : conciliadores;

    return (
        <>
            <div className="header-container">
                <h3>Relação de Conciliadores</h3>
                <Input placeholder="Buscar..." onChange={handleSearch} style={{ marginRight: 8, width: '40%' }} />
                <div className="button-group">
                    <Button 
                        icon={<PlusOutlined />} 
                        onClick={showModal}
                        type="primary" 
                        style={{ marginRight: 8 }}>
                        Adicionar
                    </Button>
                </div>
            </div>
            <div className="table-container">
                <Table dataSource={filteredConciliadores} columns={columns} rowKey="conciliador_id" />
            </div>
            <ConciliadorModal
                isVisible={isModalVisible}
                onCancel={handleCancel}
                onSubmit={handleSubmit}
                municipios={municipios}
                form={form}
                resetForm={handleReset}
            />
        </>
    );
};

export default CadastroConciliador;
