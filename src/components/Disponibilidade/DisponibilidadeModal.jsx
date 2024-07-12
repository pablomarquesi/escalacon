import React from 'react';
import { Modal, Form, Select, Checkbox, Button, Space, DatePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { MonthPicker } = DatePicker;

const DisponibilidadeModal = ({ form, isModalVisible, onFinish, onCancel, filteredConciliadores, handleConciliadorSearch, editingDisponibilidade, disabledDate, statuses }) => {
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
                    >
                        {filteredConciliadores.map(conciliador => (
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
                    <MonthPicker placeholder="Selecione o mês" format="MMMM" disabledDate={disabledDate} picker="month" />
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
                <Form.Item
                    name="status_id"
                    label="Status"
                    rules={[{ required: true, message: 'Selecione um status' }]}
                >
                    <Select placeholder="Selecione um status">
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

export default DisponibilidadeModal;
