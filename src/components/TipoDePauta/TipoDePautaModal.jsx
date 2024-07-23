import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';

const TipoDePautaModal = ({ isVisible, onCancel, onSubmit, form, editingTipoDePauta }) => {
    useEffect(() => {
        if (editingTipoDePauta) {
            form.setFieldsValue(editingTipoDePauta);
        }
    }, [editingTipoDePauta, form]);

    return (
        <Modal
            title={editingTipoDePauta ? 'Editar Tipo de Pauta' : 'Adicionar Tipo de Pauta'}
            visible={isVisible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item
                    name="nome_pauta"
                    label="Nome"
                    rules={[{ required: true, message: 'Insira o nome do tipo de pauta' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="descricao"
                    label="Descrição"
                    rules={[{ required: true, message: 'Insira a descrição do tipo de pauta' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Salvar
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

export default TipoDePautaModal;
