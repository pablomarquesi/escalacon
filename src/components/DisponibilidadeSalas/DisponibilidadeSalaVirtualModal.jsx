import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Button, Space, DatePicker, Checkbox } from 'antd';
import moment from 'moment';

const { Option } = Select;

const DisponibilidadeSalaVirtualModal = ({ form, isModalVisible, onFinish, onCancel, filteredSalas, handleSalaSearch, editingDisponibilidade }) => {
    const [selectedDays, setSelectedDays] = useState([]);

    useEffect(() => {
        if (editingDisponibilidade) {
            form.setFieldsValue({
                sala_virtual_id: editingDisponibilidade.sala_virtual_id,
                tipo: editingDisponibilidade.tipo,
                detalhes: editingDisponibilidade.detalhes,
                status_id: editingDisponibilidade.status_id,
            });
            setSelectedDays(editingDisponibilidade.detalhes || []);
        }
    }, [editingDisponibilidade, form]);

    const handleDaysChange = (checkedValues) => {
        setSelectedDays(checkedValues);
        form.setFieldsValue({ detalhes: checkedValues });
    };

    return (
        <Modal
            title={editingDisponibilidade ? 'Editar Disponibilidade' : 'Adicionar Disponibilidade'}
            visible={isModalVisible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="sala_virtual_id"
                    label="Sala Virtual"
                    rules={[{ required: true, message: 'Selecione uma sala virtual' }]}
                >
                    <Select
                        showSearch
                        placeholder="Selecione uma sala virtual"
                        onSearch={handleSalaSearch}
                        filterOption={false}
                        value={form.getFieldValue('sala_virtual_id')}
                    >
                        {filteredSalas.map(sala => (
                            <Option key={sala.sala_virtual_id} value={sala.sala_virtual_id}>
                                {sala.nome_sala_virtual}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="tipo"
                    label="Tipo"
                    rules={[{ required: true, message: 'Selecione o tipo de disponibilidade' }]}
                >
                    <Select placeholder="Selecione o tipo">
                        <Option value="Regular">Regular</Option>
                        <Option value="Sazonal">Sazonal</Option>
                        <Option value="Data Específica">Data Específica</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="detalhes"
                    label="Detalhes"
                    rules={[{ required: true, message: 'Informe os detalhes da disponibilidade' }]}
                >
                    <Checkbox.Group value={selectedDays} onChange={handleDaysChange}>
                        <Checkbox value="Segunda">Segunda</Checkbox>
                        <Checkbox value="Terça">Terça</Checkbox>
                        <Checkbox value="Quarta">Quarta</Checkbox>
                        <Checkbox value="Quinta">Quinta</Checkbox>
                        <Checkbox value="Sexta">Sexta</Checkbox>
                        <Checkbox value="Sábado">Sábado</Checkbox>
                        <Checkbox value="Domingo">Domingo</Checkbox>
                    </Checkbox.Group>
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

export default DisponibilidadeSalaVirtualModal;
