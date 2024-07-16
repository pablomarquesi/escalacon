import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import getTableColumns from "./getTableColumnsConciliador";
import { fetchConciliadores, fetchMunicipios, toggleConciliadorStatus, saveConciliador } from "../../services/conciliadorService";
import ConciliadorModal from './ConciliadorModal';
import moment from 'moment';
import HeaderSection from '../common/HeaderSection';
import CustomTable from '../common/CustomTable';


const CadastroConciliador = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [conciliadores, setConciliadores] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState('');
    const [editingRecord, setEditingRecord] = useState(null);

    useEffect(() => {
        const initData = async () => {
            try {
                let conciliadoresData = await fetchConciliadores();
                const municipiosData = await fetchMunicipios();
                
                // Ordenação dos conciliadores
                conciliadoresData = conciliadoresData.sort((a, b) => {
                    if (a.status_conciliador !== b.status_conciliador) {
                        return a.status_conciliador === 'Ativo' ? -1 : 1;
                    }
                    return a.nome_conciliador.localeCompare(b.nome_conciliador);
                });

                setConciliadores(conciliadoresData);
                setMunicipios(municipiosData);
            } catch (error) {
                console.error('Erro ao buscar dados iniciais:', error);
                message.error('Erro ao buscar dados iniciais. Tente novamente.');
            }
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

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        try {
            await toggleConciliadorStatus(id, newStatus);
            message.success(`Conciliador ${newStatus === 'Ativo' ? 'ativado' : 'inativado'} com sucesso`);
            let conciliadoresData = await fetchConciliadores();

            // Ordenação dos conciliadores
            conciliadoresData = conciliadoresData.sort((a, b) => {
                if (a.status_conciliador !== b.status_conciliador) {
                    return a.status_conciliador === 'Ativo' ? -1 : 1;
                }
                return a.nome_conciliador.localeCompare(b.nome_conciliador);
            });

            setConciliadores(conciliadoresData);
        } catch (error) {
            console.error('Erro ao alterar status do conciliador:', error);
            message.error('Erro ao alterar status do conciliador. Tente novamente.');
        }
    };

    const columns = getTableColumns(handleEdit, handleToggleStatus);

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
            let conciliadoresData = await fetchConciliadores();

            // Ordenação dos conciliadores
            conciliadoresData = conciliadoresData.sort((a, b) => {
                if (a.status_conciliador !== b.status_conciliador) {
                    return a.status_conciliador === 'Ativo' ? -1 : 1;
                }
                return a.nome_conciliador.localeCompare(b.nome_conciliador);
            });

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
            <HeaderSection
                title="Relação de Conciliadores"
                onSearch={handleSearch}
                searchText={searchText}
            >
                <Button 
                    icon={<PlusOutlined />} 
                    onClick={showModal}
                    type="primary"
                    className="custom-button"
                >
                    Adicionar
                </Button>
            </HeaderSection>
            <CustomTable 
                dataSource={filteredConciliadores} 
                columns={columns} 
                rowKey="conciliador_id"
            />
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
