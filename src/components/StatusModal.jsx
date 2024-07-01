import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Modal, message } from 'antd';

const { TextArea } = Input;

const StatusModal = ({ isVisible, onCancel, onSubmit, form }) => {
    const handleReset = () => {
        form.resetFields();
    };

    return (
        <Modal title="Cadastro de Status" visible={isVisible} onCancel={onCancel} footer={null}>
            <Form
                form={form}
                layout="vertical"
                onFinish={async (values) => {
                    try {
                        await onSubmit(values);
                        message.success('Status salvo com sucesso');
                        form.resetFields();
                        onCancel(); // Fechar o modal
                    } catch (error) {
                        message.error('Erro ao salvar status. Tente novamente.');
                    }
                }}
            >
                <Form.Item name="nome_status" label="Nome do Status" rules={[{ required: true, message: 'Insira o nome do status!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="descricao_status" label="Descrição" rules={[{ required: true, message: 'Insira a descrição!' }]}>
                    <TextArea rows={4} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                        Salvar
                    </Button>
                    <Button htmlType="button" onClick={handleReset}>
                        Limpar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

StatusModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
};

export default StatusModal;
