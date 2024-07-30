import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Checkbox, Button, Space, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { MonthPicker } = DatePicker;

const getBusinessDays = (year, month) => {
    let date = moment([year, month - 1]);
    let businessDays = 0;
    while (date.month() === month - 1) {
        if (date.day() !== 0 && date.day() !== 6) {
            businessDays++;
        }
        date.add(1, 'day');
    }
    return businessDays;
};

const DisponibilidadeConciliadorModal = ({ form, isModalVisible, onFinish, onCancel, filteredConciliadores, handleConciliadorSearch, editingDisponibilidade, disabledDate, statuses }) => {
    const [selectedDays, setSelectedDays] = useState([]);
    const [monthYear, setMonthYear] = useState({ year: null, month: null });
    const [businessDays, setBusinessDays] = useState([]);

    useEffect(() => {
        const { year, month } = monthYear;
        if (year && month) {
            const days = getBusinessDays(year, month);
            setBusinessDays(days);
        }
    }, [monthYear]);

    useEffect(() => {
        if (editingDisponibilidade) {
            form.setFieldsValue({
                conciliador_id: editingDisponibilidade.conciliador_id,
                ano: editingDisponibilidade.ano,
                mes: moment(editingDisponibilidade.mes, 'YYYY-MM'),
                quantidade_dias: editingDisponibilidade.quantidade_dias,
                dias_da_semana: editingDisponibilidade.dias_da_semana,
                status_id: editingDisponibilidade.status_id,
            });
            setSelectedDays(editingDisponibilidade.dias_da_semana || []);
        }
    }, [editingDisponibilidade, form]);

    const handleDaysChange = (checkedValues) => {
        setSelectedDays(checkedValues);
        form.setFieldsValue({ dias_da_semana: checkedValues });
    };

    const handleMonthChange = (date) => {
        if (date) {
            setMonthYear({ year: date.year(), month: date.month() + 1 });
        } else {
            setMonthYear({ year: null, month: null });
            setBusinessDays([]);
        }
    };

    const activeConciliadores = filteredConciliadores.filter(conciliador => conciliador.status_conciliador === 'Ativo');

    return (
        <Modal
            title={editingDisponibilidade ? 'Editar Disponibilidade' : 'Adicionar Disponibilidade'}
            visible={isModalVisible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
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
                        value={form.getFieldValue('conciliador_id')}
                    >
                        {activeConciliadores.map(conciliador => (
                            <Option key={conciliador.conciliador_id} value={conciliador.conciliador_id}>
                                {conciliador.nome_conciliador}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="ano"
                    label="Ano"
                    rules={[{ required: true, message: 'Selecione o ano' }]}
                >
                    <Select placeholder="Selecione o ano">
                        {Array.from({ length: 10 }, (_, i) => {
                            const year = moment().year() + i;
                            return (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="mes"
                    label="Mês"
                    rules={[{ required: true, message: 'Selecione o mês' }]}
                >
                    <MonthPicker placeholder="Selecione o mês" format="MMMM" disabledDate={disabledDate} picker="month" onChange={handleMonthChange} />
                </Form.Item>
                <Form.Item
                    name="quantidade_dias"
                    label="Quantidade de Dias"
                    rules={[{ required: true, message: 'Informe a quantidade de dias disponíveis' }]}
                >
                    <Select placeholder="Quantidade de Dias">
                        {Array.from({ length: businessDays }, (_, i) => (
                            <Option key={i + 1} value={i + 1}>
                                {i + 1}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="dias_da_semana"
                    label="Dias da Semana"
                    rules={[{ required: true, message: 'Selecione ao menos um dia da semana' }]}
                >
                    <Checkbox.Group value={selectedDays} onChange={handleDaysChange}>
                        <Checkbox value="Segunda">Segundas</Checkbox>
                        <Checkbox value="Terça">Terças</Checkbox>
                        <Checkbox value="Quarta">Quartas</Checkbox>
                        <Checkbox value="Quinta">Quintas</Checkbox>
                        <Checkbox value="Sexta">Sextas</Checkbox>
                    </Checkbox.Group>
                </Form.Item>
                <Form.Item
                    name="status_id"
                    label="Status"
                    rules={[{ required: true, message: 'Selecione um status' }]}
                >
                    <Select placeholder="Selecione um status" value={form.getFieldValue('status_id')}>
                        {statuses.map(status => (
                            <Option key={status.status_id} value={status.status_id}>
                                {status.nome_status}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            {editingDisponibilidade ? 'Salvar Alterações' : 'Adicionar'}
                        </Button>
                        <Button type="default" onClick={onCancel}>
                            Cancelar
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DisponibilidadeConciliadorModal;
