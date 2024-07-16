import React, { useEffect, useState } from 'react';
import { Form, Button, message, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import { fetchDisponibilidades, saveDisponibilidade, deleteDisponibilidade } from '../../services/disponibilidadeService';
import { fetchConciliadores } from '../../services/conciliadorService';
import { fetchStatus } from '../../services/statusService';
import DisponibilidadeModal from './DisponibilidadeModal';
import HeaderSection from '../common/HeaderSection';
import CustomTable from '../common/CustomTable';

moment.locale('pt-br');

const Disponibilidade = () => {
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

    useEffect(() => {
        loadDisponibilidades();
        loadConciliadores();
        loadStatuses();
    }, []);

    const loadDisponibilidades = async () => {
        try {
            const data = await fetchDisponibilidades();
            setDisponibilidades(data);
            setFilteredDisponibilidades(data); // Inicialmente, todos os dados são exibidos
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
                await deleteDisponibilidade(editingDisponibilidade.id);
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
            dias_da_semana: record.dia_da_semana.split(',').map(dia => dia.trim()),
            status_id: record.status_id
        };
        form.setFieldsValue(fieldsValue);
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDisponibilidade(id);
            loadDisponibilidades();
            message.success('Disponibilidade excluída com sucesso');
        } catch (error) {
            console.error('Erro ao excluir disponibilidade:', error);
            message.error('Erro ao excluir disponibilidade');
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
        },
        {
            title: 'Ano',
            dataIndex: 'ano',
            key: 'ano',
            align: 'center', // Centralizar dados
        },
        {
            title: 'Mês',
            dataIndex: 'mes',
            key: 'mes',
            render: (text) => moment(text, 'YYYY-MM').format('MMMM'),
            align: 'center', // Centralizar dados
        },
        {
            title: 'Qtd de dias disponíveis', // Alterar a label da coluna
            dataIndex: 'quantidade_dias',
            key: 'quantidade_dias',
            align: 'center', // Centralizar dados
        },
        {
            title: 'Dias da Semana',
            dataIndex: 'dias_da_semana',
            key: 'dias_da_semana',
            render: (dias) => dias.join(', '),
            align: 'left',
        },
        {
            title: 'Status',
            dataIndex: 'nome_status',
            key: 'status',
            align: 'left',
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
            align: 'left',
            render: (text, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    />
                    <Button
                        type="danger"
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <HeaderSection
                title="Gerenciar Disponibilidade"
                onSearch={handleSearch}
                searchText={searchText}
            >
                <Button type="primary" onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
                    Adicionar disponibilidade
                </Button>
            </HeaderSection>
            <CustomTable 
                columns={columns} 
                dataSource={groupedDisponibilidades} 
                rowKey="id" 
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
                statuses={statuses} // Passando os statuses para o modal
            />
        </div>
    );
};

export default Disponibilidade;
