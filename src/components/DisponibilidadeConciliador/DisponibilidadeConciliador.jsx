import React, { useEffect, useState } from 'react';
import { Form, Button, message, Space, Tooltip, Switch, Popconfirm } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import { fetchDisponibilidadesConciliadores, saveDisponibilidadeConciliadores, toggleDisponibilidadeStatusConciliadores } from '../../services/disponibilidadeConciliadorService';
import { fetchConciliadores } from '../../services/conciliadorService';
import { fetchStatus } from '../../services/statusService';
import DisponibilidadeModal from './DisponibilidadeConciliadorModal';
import HeaderSection from '../common/HeaderSection';
import CustomTable from '../common/CustomTable';

moment.locale('pt-br');

const DisponibilidadeConciliador = () => {
    const [form] = Form.useForm();
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [filteredDisponibilidades, setFilteredDisponibilidades] = useState([]);
    const [conciliadores, setConciliadores] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [filteredConciliadores, setFilteredConciliadores] = useState([]);
    const [editingDisponibilidade, setEditingDisponibilidade] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(() => {
        loadDisponibilidades();
        loadConciliadores();
        loadStatuses();
    }, []);

    const loadDisponibilidades = async () => {
        try {
            const data = await fetchDisponibilidadesConciliadores();
            setDisponibilidades(data);
            setFilteredDisponibilidades(data);
        } catch (error) {
            message.error('Erro ao carregar disponibilidades');
        }
    };

    const loadConciliadores = async () => {
        try {
            const data = await fetchConciliadores();
            setConciliadores(data);
            setFilteredConciliadores(data);
        } catch (error) {
            message.error('Erro ao carregar conciliadores');
        }
    };

    const loadStatuses = async () => {
        try {
            const data = await fetchStatus();
            setStatuses(data);
        } catch (error) {
            message.error('Erro ao carregar statuses');
        }
    };

    const handleFinish = async (values) => {
        try {
            const disponibilidadeData = {
                conciliador_id: values.conciliador_id,
                ano: values.ano,
                mes: values.mes.format('YYYY-MM'),
                quantidade_dias: values.quantidade_dias,
                dias_da_semana: values.dias_da_semana,
                status_id: values.status_id
            };

            if (editingDisponibilidade) {
                disponibilidadeData.id = editingDisponibilidade.id;
            }

            await saveDisponibilidade(disponibilidadeData);

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
            conciliador_id: record.conciliador_id,
            ano: record.ano,
            mes: moment(record.mes, 'YYYY-MM'),
            quantidade_dias: record.quantidade_dias,
            dias_da_semana: Array.isArray(record.dias_da_semana) ? record.dias_da_semana : (record.dias_da_semana || '').split(',').map(dia => dia.trim()),
            status_id: record.status_id
        };
        form.setFieldsValue(fieldsValue);
        setIsModalVisible(true);
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
        try {
            await toggleDisponibilidadeStatus(id, newStatus);
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
            disponibilidade.nome_conciliador.toLowerCase().includes(value)
        );
        setFilteredDisponibilidades(filtered);
    };

    const handleConciliadorSearch = (value) => {
        const filtered = conciliadores.filter(conciliador =>
            conciliador.nome_conciliador.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredConciliadores(filtered);
    };

    const disabledDate = (current) => {
        return current && current < moment().startOf('month');
    };

    const groupByConciliadorMes = filteredDisponibilidades.reduce((acc, curr) => {
        const key = `${curr.nome_conciliador}-${curr.ano}-${curr.mes}`;
        if (!acc[key]) {
            acc[key] = { ...curr, dias_da_semana: [curr.dia_da_semana] };
        } else {
            acc[key].dias_da_semana.push(curr.dia_da_semana);
        }
        return acc;
    }, {});

    const groupedDisponibilidades = Object.values(groupByConciliadorMes);

    const columns = [
        {
            title: 'Conciliador',
            dataIndex: 'nome_conciliador',
            key: 'nome_conciliador',
            align: 'left',
            sorter: (a, b) => (a.nome_conciliador || "").toString().localeCompare((b.nome_conciliador || "").toString()),
        },
        {
            title: 'Ano',
            dataIndex: 'ano',
            key: 'ano',
            align: 'center',
            sorter: (a, b) => (a.ano || "").toString().localeCompare((b.ano || "").toString()),
        },
        {
            title: 'Mês',
            dataIndex: 'mes',
            key: 'mes',
            render: (text) => moment(text, 'YYYY-MM').format('MMMM'),
            align: 'center',
            sorter: (a, b) => {
                const monthA = moment(a.mes, 'YYYY-MM').month();
                const monthB = moment(b.mes, 'YYYY-MM').month();
                return monthA - monthB;
            },
        },
        {
            title: 'Qtd de dias disponíveis',
            dataIndex: 'quantidade_dias',
            key: 'quantidade_dias',
            align: 'center',
            sorter: (a, b) => (a.quantidade_dias || "").toString().localeCompare((b.quantidade_dias || "").toString()),
        },
        {
            title: 'Dias da Semana',
            dataIndex: 'dias_da_semana',
            key: 'dias_da_semana',
            render: (dias) => Array.isArray(dias) ? dias.join(', ') : dias,
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
                title="Gerenciar Disponibilidades Conciliador"
                onSearch={handleSearch}
                searchText={searchText}
            >
                <Button type="primary" onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
                    Adicionar
                </Button>
            </HeaderSection>
            <CustomTable 
                columns={columns} 
                dataSource={groupedDisponibilidades} 
                rowKey="id"
                rowSelection={rowSelection} 
                pagination={{ pageSize, onChange: (page, size) => setPageSize(size), showSizeChanger: true, pageSizeOptions: ['10', '20', '30', '40'] }}
            />
            <DisponibilidadeModal 
                form={form}
                isModalVisible={isModalVisible}
                onFinish={handleFinish}
                onCancel={handleModalCancel}
                filteredConciliadores={filteredConciliadores}
                handleConciliadorSearch={handleConciliadorSearch}
                editingDisponibilidade={editingDisponibilidade}
                disabledDate={disabledDate}
                statuses={statuses}
            />
        </div>
    );
};

export default DisponibilidadeConciliador;
