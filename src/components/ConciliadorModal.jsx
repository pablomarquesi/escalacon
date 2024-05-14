import React from 'react';
import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import moment from 'moment';
import InputMask from 'react-input-mask'; // Importando o InputMask para máscaras

const ConciliadorModal = ({ isVisible, onCancel, onSubmit, municipios, form, resetForm }) => {
    // Função para garantir que apenas números sejam inseridos no campo matrícula
    const handleNumberInput = (e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove qualquer coisa que não seja número
        form.setFieldsValue({ matricula: value });
    };

    // Função para desabilitar datas futuras
    const disabledFutureDate = (current) => {
        // Pode selecionar dias até hoje, incluindo hoje
        return current && current > moment().endOf('day');
    };

    return (
        <Modal title="Cadastro de Conciliador" visible={isVisible} onCancel={onCancel} footer={null}>
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Form.Item name="matricula" label="Matrícula" rules={[{ required: true, message: 'Insira a matrícula!' }]}>
                    <Input onChange={handleNumberInput} value={form.getFieldValue('matricula')} />
                </Form.Item>
                <Form.Item name="nome_conciliador" label="Nome" rules={[{ required: true, message: 'Insira o nome!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="cpf" label="CPF" rules={[{ required: true, message: 'Insira o CPF!' }]}>
                    <InputMask mask="999.999.999-99" className="ant-input">
                        {(inputProps) => <Input {...inputProps} />}
                    </InputMask>
                </Form.Item>
                <Form.Item name="telefone" label="Telefone" rules={[{ required: true, message: 'Insira o telefone!' }]}>
                    <InputMask mask="(99) 99999-9999" className="ant-input">
                        {(inputProps) => <Input {...inputProps} />}
                    </InputMask>
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Insira o e-mail!', type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="comarca_id" label="Comarca" rules={[{ required: true, message: 'Selecione a comarca!' }]}>
                    <Select placeholder="Selecione">
                        {municipios.map(municipio => (
                            <Select.Option key={municipio.comarca_id} value={municipio.comarca_id}>
                                {municipio.nome_comarca}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item name="data_credenciamento" label="Data de Credenciamento" rules={[{ required: true, message: 'Selecione a data de credenciamento!' }]}>
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" disabledDate={disabledFutureDate} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                        Salvar
                    </Button>
                    <Button htmlType="button" onClick={resetForm}>
                        Limpar
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ConciliadorModal;
