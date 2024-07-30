import React, { useEffect, useState } from 'react';
import { Form, Button, message, Space, Tooltip, Switch, Popconfirm } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import { fetchDisponibilidadesSalas, saveDisponibilidadeSala, toggleDisponibilidadeSalaStatus } from '../../services/disponibilidadeSalaService';
import { fetchSalasVirtuais } from '../../services/salaVirtualService';
import DisponibilidadeSalaVirtualModal from './DisponibilidadeSalaVirtualModal';
import HeaderSection from '../common/HeaderSection';
import CustomTable from '../common/CustomTable';

moment.locale('pt-br');

const DisponibilidadeSalaVirtual = () => {
    const [form] = Form.useForm();
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [filteredDisponibilidades, setFilteredDisponibilidades] = useState([]);
    const [salas, setSalas] = useState([]);
    const [filteredSalas, setFilteredSalas] = useState([]);
    const [editingDisponibilidade, setEditingDisponibilidade] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        loadDisponibilidades();
        loadSalasVirtuais();
    }, []);

    const loadDisponibilidades = async () => {
        try {
            const data = await fetchDisponibilidadesSalas();
            setDisponibilidades(data);
            setFilteredDisponibilidades(data);
        } catch (error) {
            message.error('Erro ao carregar disponibilidades');
        }
    };

    const loadSalasVirtuais = async () => {
        try {
            const data = await fetchSalasVirtuais();
            setSalas(data);
            setFilteredSalas(data);
        } catch (error) {
            message.error('Erro ao carregar salas virtuais');
        }
    };

    const handleFinish = async (values) => {
        try {
            const disponibilidadeData = {
                sala_virtual_id: values.sala_virtual_id,
                tipo: values.tipo,
                detalhes: values.detalhes,
                status_id: values.status_id
            };

            if (editingDisponibilidade) {
                disponibilidadeData.id = editingDisponibilidade.id;
            }

            await saveDisponibilidadeSala(disponibilidadeData);

            form.resetFields();
            setEditingDisponibilidade(null);
            loadDisponibilidades();
            setIsModalVisible(false);
            message.success('Disponibilidade salva com sucesso');
        } catch (error) {
            message.error(error.message || 'Erro ao salvar disponibilidade');
        }
    };

    const handleEdit = (record) => {
        setEditingDisponibilidade(record);
        const fieldsValue = {
            sala_virtual_id: record.sala_virtual_id,
            tipo: record.tipo,
            detalhes: record.detalhes,
            status_id: record.status_id
        };
        form.setFieldsValue(fieldsValue);
        setIsModalVisible(true);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        try {
            await toggleDisponibilidadeSalaStatus(id, newStatus);
            message.success(`Disponibilidade ${newStatus === 'Ativo' ? 'ativada' : 'inativada'} com sucesso`);
            loadDisponibilidades();
        } catch (error) {
            console.error('Erro ao alterar status da disponibilidade:', error);
            message.error('Erro ao alterar status da disponibilidade. Tente novamente.');
        }
    };

    const handleModalCancel = () => {
        setEditingDisponibilidade(null);
        form.resetFields();
        setIsModalVisible(false);
    };

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        const filtered = disponibilidades.filter(disponibilidade =>
            disponibilidade.nome_sala_virtual.toLowerCase().includes(value)
        );
        setFilteredDisponibilidades(filtered);
    };

    const handleSalaSearch = (value) => {
        const filtered = salas.filter(sala =>
            sala.nome_sala_virtual.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredSalas(filtered);
    };

    const columns = [
        {
            title: 'Sala Virtual',
            dataIndex: 'nome_sala_virtual',
            key: 'nome_sala_virtual',
            align: 'left',
            sorter: (a, b) => (a.nome_sala_virtual || "").toString().localeCompare((b.nome_sala_virtual || "").toString()),
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            align: 'center',
            sorter: (a, b) => (a.tipo || "").toString().localeCompare((b.tipo || "").toString()),
        },
        {
            title: 'Detalhes',
            dataIndex: 'detalhes',
            key: 'detalhes',
            align: 'left',
        },
        {
            title: 'Status',
            dataIndex: 'nome_status',
            key: 'status',
            align: 'center',
            sorter: (a, b) => (a.nome_status || "").toString().localeCompare((b.nome_status || "").toString()),
            render: (text, record) => {
                return (
                    <Tooltip title={record.descricao_status || 'Sem descrição'}>
                        <span>{record.nome_status || 'Sem status'}</span>
                    </Tooltip>
                );
            },
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
                        onClick={() => handleEdit(record)}
                    />
                    <Popconfirm
                        title={`Tem certeza que deseja ${record.status_disponibilidade === 'Ativo' ? 'inativar' : 'ativar'} esta disponibilidade?`}
                        onConfirm={() => handleToggleStatus(record.id, record.status_disponibilidade)}
                        okText="Sim"
                        cancelText="Não"
                    >
                        <Switch
                            checked={record.status_disponibilidade === 'Ativo'}
                        />
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
                title="Gerenciar Disponibilidades de Salas Virtuais"
                onSearch={handleSearch}
                searchText={searchText}
            >
                <Button type="primary" onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
                    Adicionar
                </Button>
            </HeaderSection>
            <CustomTable 
                columns={columns} 
                dataSource={filteredDisponibilidades} 
                rowKey="id"
                rowSelection={rowSelection} 
                pagination={{ pageSize, onChange: (page, size) => setPageSize(size), showSizeChanger: true, pageSizeOptions: ['10', '20', '30', '40'] }}
            />
            <DisponibilidadeSalaVirtualModal 
                form={form}
                isModalVisible={isModalVisible}
                onFinish={handleFinish}
                onCancel={handleModalCancel}
                filteredSalas={filteredSalas}
                handleSalaSearch={handleSalaSearch}
                editingDisponibilidade={editingDisponibilidade}
            />
        </div>
    );
};

export default DisponibilidadeSalaVirtual;
