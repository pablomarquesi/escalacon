// ManualEntryModal.jsx
import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const ManualEntryModal = ({
    isManualModalVisible, handleManualModalOk, handleManualModalCancel,
    selectedCell, comarcas, currentConciliadores
}) => {
    const conciliador = currentConciliadores.find(c => c.conciliador_id === selectedCell?.conciliadorId);

    return (
        <Modal
            title="Inserir Escala Manual"
            visible={isManualModalVisible}
            onCancel={handleManualModalCancel}
            footer={null}
        >
            {selectedCell && conciliador && (
                <Form onFinish={handleManualModalOk} layout="vertical">
                    <Form.Item label="Nome do Conciliador">
                        <Input value={conciliador.nome_conciliador} disabled />
                    </Form.Item>
                    <Form.Item label="Dia">
                        <Input value={selectedCell.dia} disabled />
                    </Form.Item>
                    <Form.Item name="comarca" label="Comarca" rules={[{ required: true, message: 'Por favor, selecione uma comarca!' }]}>
                        <Select placeholder="Selecione a comarca">
                            {comarcas.map(comarca => (
                                <Select.Option key={comarca.comarca_id} value={comarca.comarca_id}>
                                    {comarca.nome_comarca}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name="juizado" label="Juizado" rules={[{ required: true, message: 'Por favor, selecione um juizado!' }]}>
                        <Select placeholder="Selecione o juizado">
                            <Select.Option value="1">Juizado 1</Select.Option>
                            <Select.Option value="2">Juizado 2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="salaVirtual" label="Sala Virtual" rules={[{ required: true, message: 'Por favor, selecione uma sala virtual!' }]}>
                        <Select placeholder="Selecione a sala virtual">
                            <Select.Option value="1">Sala Virtual 1</Select.Option>
                            <Select.Option value="2">Sala Virtual 2</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>Salvar</Button>
                        <Button onClick={handleManualModalCancel}>Cancelar</Button>
                    </Form.Item>
                </Form>
            )}
        </Modal>
    );
};

export default ManualEntryModal;
