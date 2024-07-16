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
            const diasSelecionados = values.dias_da_semana || [];
            const disponibilidadesData = diasSelecionados.map(dia => ({
                conciliador_id: values.conciliador_id,
                dia_da_semana: dia,
                mes: `${values.ano}-${values.mes.format('MM')}`,
                ano: values.ano,
                status_id: values.status_id
            }));

            if (editingDisponibilidade) {
                const diasExistentes = editingDisponibilidade.dia_da_semana.split(',').map(dia => dia.trim());
                const diasParaRemover = diasExistentes.filter(dia => !diasSelecionados.includes(dia));
                const diasParaAdicionar = diasSelecionados.filter(dia => !diasExistentes.includes(dia));

                for (const dia of diasParaRemover) {
                    await deleteDisponibilidade(values.conciliador_id, `${values.ano}-${values.mes.format('MM')}`, values.ano, dia);
                }

                for (const dia of diasParaAdicionar) {
                    await saveDisponibilidade([{ 
                        conciliador_id: values.conciliador_id, 
                        dia_da_semana: dia, 
                        mes: `${values.ano}-${values.mes.format('MM')}`,
                        ano: values.ano,
                        status_id: values.status_id
                    }]);
                }
            } else {
                await saveDisponibilidade(disponibilidadesData);
            }

            form.resetFields();
            setEditingDisponibilidade(null);
            loadDisponibilidades();
            setIsModalVisible(false);
            message.success('Disponibilidade salva com sucesso');
        } catch (error) {
            console.error('Erro ao salvar disponibilidade:', error);
            message.error('Erro ao salvar disponibilidade');
        }
    };

    const handleEdit = (record) => {
        setEditingDisponibilidade(record);
        const dias_da_semana = record.dia_da_semana.split(',').map(dia => dia.trim());
        const fieldsValue = {
            conciliador_id: record.conciliador_id,
            dias_da_semana,
            mes: moment(record.mes, 'YYYY-MM'),
            ano: record.ano,
            status_id: record.status_id
        };
        form.setFieldsValue(fieldsValue);
        setIsModalVisible(true);
    };

    const handleDelete = async (conciliador_id, mes, ano) => {
        try {
            await deleteDisponibilidade(conciliador_id, mes, ano);
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
        setSearchText(e.target.value.toLowerCase());
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

    const filteredDisponibilidades = disponibilidades.filter(disponibilidade => 
        disponibilidade.nome_conciliador.toLowerCase().includes(searchText)
    );

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
            align: 'left',
        },
        {
            title: 'Mês',
            dataIndex: 'mes',
            key: 'mes',
            render: (text) => moment(text, 'YYYY-MM').format('MMMM'),
            align: 'left',
        },
        {
            title: 'Dias da Semana',
            dataIndex: 'dia_da_semana',
            key: 'dia_da_semana',
            render: (text) => text ? text.split(',').join(', ') : '',
            align: 'left',
        },
        {
            title: 'Status',
            dataIndex: 'nome_status',
            key: 'status',
            align: 'left',
            render: (text, record) => {
                const status = statuses.find(s => s.nome_status === record.nome_status);
                return (
                    <Tooltip title={status ? status.descricao : 'Sem descrição'}>
                        <span>{text}</span>
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
                        onClick={() => handleDelete(record.conciliador_id, record.mes, record.ano)}
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
                dataSource={filteredDisponibilidades} 
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
