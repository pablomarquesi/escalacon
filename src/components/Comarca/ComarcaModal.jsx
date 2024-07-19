import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Input, Modal } from 'antd';

const ComarcaModal = ({ isVisible, onCancel, onSubmit, form }) => {
    const handleReset = () => {
        form.resetFields();
    };

    return (
        <Modal
            title="Cadastro de Comarca"
            visible={isVisible}
            onCancel={onCancel}
            footer={null}
            style={{ top: 20 }}
            bodyStyle={{ padding: '20px 24px' }}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item name="nome_comarca" label="Nome da Comarca" rules={[{ required: true, message: 'Insira o nome da comarca!' }]}>
                    <Input />
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
                        onClick={handleReset}>
                        Limpar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

ComarcaModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    form: PropTypes.object.isRequired,
};

export default ComarcaModal;
