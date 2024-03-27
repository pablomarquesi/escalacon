// ConciliadorModal.jsx
import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import moment from 'moment';

const ConciliadorModal = ({ isVisible, onClose, municipios, onSubmit, initialData }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        data_credenciamento: initialData.data_credenciamento ? moment(initialData.data_credenciamento) : null,
      });
    }
  }, [initialData, form]);

  const handleFinish = async (values) => {
    await onSubmit({ ...values, data_credenciamento: values.data_credenciamento.format('YYYY-MM-DD') });
    onClose();
    form.resetFields();
  };

  return (
    <Modal title="Cadastro de Conciliador" visible={isVisible} onCancel={onClose} footer={null}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {/* Form Items */}
        <Form.Item>
          <Button type="primary" htmlType="submit">Salvar</Button>
          <Button htmlType="button" onClick={() => form.resetFields()}>Limpar</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConciliadorModal;
