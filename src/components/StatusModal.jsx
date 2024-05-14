import React from 'react';
import { Button, Form, Input, Modal } from 'antd';

const { TextArea } = Input;

const StatusModal = ({ isVisible, onCancel, onSubmit, form }) => {
    return (
        <Modal title="Cadastro de Status" visible={isVisible} onCancel={onCancel} footer={null}>
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item name="nome_status" label="Nome do Status" rules={[{ required: true, message: 'Insira o nome do status!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="descricao_status" label="Descrição" rules={[{ required: true, message: 'Insira a descrição!' }]}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button 
                        type="primary" 
                        htmlType="submit" 
                        style={{ marginRight: 8 }}>
                        Salvar
                    </Button>
                    <Button 
                        htmlType="button" 
                        onClick={form.resetFields}>
                        Limpar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default StatusModal;
