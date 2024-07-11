import React, { useEffect, useState } from 'react';
import { Table, Form, Checkbox, Button, Select, message, Modal, Row, Col, Space, DatePicker } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchDisponibilidades, saveDisponibilidade, deleteDisponibilidade } from '../services/disponibilidadeService';
import { fetchConciliadores } from '../services/conciliadorService';
import moment from 'moment';
import 'moment/locale/pt-br';
import SearchBar from './SearchBar'; // Importe o novo componente

moment.locale('pt-br');

const { Option } = Select;
const { MonthPicker } = DatePicker;

const Disponibilidade = () => {
    const [form] = Form.useForm();
    const [disponibilidades, setDisponibilidades] = useState([]);
    const [conciliadores, setConciliadores] = useState([]);
    const [filteredConciliadores, setFilteredConciliadores] = useState([]);
    const [editingDisponibilidade, setEditingDisponibilidade] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        loadDisponibilidades();
        loadConciliadores();
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

    const handleFinish = async (values) => {
        try {
            const diasSelecionados = values.dias_da_semana || [];
            const disponibilidadesData = diasSelecionados.map(dia => ({
                conciliador_id: values.conciliador_id,
                dia_da_semana: dia,
                mes: values.mes.format('YYYY-MM')
            }));

            if (editingDisponibilidade) {
                const diasExistentes = editingDisponibilidade.dias_da_semana.split(',').map(dia => dia.trim());
                const diasParaRemover = diasExistentes.filter(dia => !diasSelecionados.includes(dia));
                const diasParaAdicionar = diasSelecionados.filter(dia => !diasExistentes.includes(dia));

                for (const dia of diasParaRemover) {
                    await deleteDisponibilidade(values.conciliador_id, values.mes.format('YYYY-MM'), dia);
                }

                for (const dia of diasParaAdicionar) {
                    await saveDisponibilidade([{ 
                        conciliador_id: values.conciliador_id, 
                        dia_da_semana: dia, 
                        mes: values.mes.format('YYYY-MM') 
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
            message.error('Erro ao salvar disponibilidade');
        }
    };

    const handleEdit = (record) => {
        setEditingDisponibilidade(record);
        const dias_da_semana = record.dias_da_semana.split(',').map(dia => dia.trim());
        form.setFieldsValue({ 
            conciliador_id: record.conciliador_id,
            dias_da_semana,
            mes: moment(record.mes, 'YYYY-MM')
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (conciliador_id, mes) => {
        try {
            const formattedMes = moment(mes).format('YYYY-MM');
            await deleteDisponibilidade(conciliador_id, formattedMes);
            loadDisponibilidades();
            message.success('Disponibilidade excluída com sucesso');
        } catch (error) {
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
        // Can not select days before today
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
            title: 'Mês',
            dataIndex: 'mes',
            key: 'mes',
            render: (text) => moment(text, 'YYYY-MM').format('MMMM'),
            align: 'left',
        },
        {
            title: 'Dias da Semana',
            dataIndex: 'dias_da_semana',
            key: 'dias_da_semana',
            render: (text) => text.split(',').join(', '),
            align: 'left',
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
                        onClick={() => handleDelete(record.conciliador_id, record.mes)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Row gutter={16} align="middle" style={{ marginBottom: 20 }}>
                <Col flex="auto">
                    <h2 style={{ fontSize: '16px', margin: 0 }}>Gerenciar Disponibilidade</h2>
                </Col>
                <Col flex="auto" style={{ textAlign: 'center' }}>
                    <SearchBar
                        placeholder="Buscar conciliador"
                        onChange={handleSearch}
                        value={searchText}
                    />
                </Col>
                <Col flex="none">
                    <Button type="primary" onClick={() => setIsModalVisible(true)} icon={<PlusOutlined />}>
                        Adicionar disponibilidade
                    </Button>
                </Col>
            </Row>
            <Table 
                columns={columns} 
                dataSource={filteredDisponibilidades} 
                rowKey="conciliador_id" 
                pagination={{ pageSize, onChange: (page, size) => setPageSize(size), showSizeChanger: true, pageSizeOptions: ['10', '20', '30', '40'] }}
            />
            <Modal
                title={editingDisponibilidade ? 'Editar Disponibilidade' : 'Adicionar Disponibilidade'}
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    <Form.Item
                        name="conciliador_id"
                        label="Conciliador"
                        rules={[{ required: true, message: 'Selecione um conciliador' }]}
                    >
                        <Select
                            showSearch
                            placeholder="Selecione um conciliador"
                            onSearch={handleConciliadorSearch}
                            filterOption={false}
                        >
                            {filteredConciliadores.map(conciliador => (
                                <Option key={conciliador.conciliador_id} value={conciliador.conciliador_id}>
                                    {conciliador.nome_conciliador}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="mes"
                        label="Mês"
                        rules={[{ required: true, message: 'Selecione o mês' }]}
                    >
                        <MonthPicker placeholder="Selecione o mês" format="MMMM" disabledDate={disabledDate} />
                    </Form.Item>
                    <Form.Item
                        name="dias_da_semana"
                        label="Dias da Semana"
                        rules={[{ required: true, message: 'Selecione ao menos um dia da semana' }]}
                    >
                        <Checkbox.Group>
                            <Checkbox value="Segunda">Segundas</Checkbox>
                            <Checkbox value="Terça">Terças</Checkbox>
                            <Checkbox value="Quarta">Quartas</Checkbox>
                            <Checkbox value="Quinta">Quintas</Checkbox>
                            <Checkbox value="Sexta">Sextas</Checkbox>
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                {editingDisponibilidade ? 'Salvar Alterações' : 'Adicionar'}
                            </Button>
                            <Button type="default" onClick={handleModalCancel}>
                                Cancelar
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Disponibilidade;
